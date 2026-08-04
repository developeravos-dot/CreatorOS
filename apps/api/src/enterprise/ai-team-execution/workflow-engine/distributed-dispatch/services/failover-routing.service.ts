import {
  Injectable,
} from '@nestjs/common';

import type {
  QueueWorkerRegistration,
} from '../../../../../modules/queue-infrastructure';
import {
  LOAD_BALANCING_STRATEGIES,
  LoadBalancerService,
  type LoadBalancerDecision,
  type LoadBalancerRequest,
  type LoadBalancingStrategy,
} from './load-balancer.service';

export const FAILOVER_ROUTING_REASON_CODES = [
  'primary_selected',
  'failover_selected',
  'no_eligible_worker',
  'attempts_exhausted',
] as const;

export type FailoverRoutingReasonCode =
  (typeof FAILOVER_ROUTING_REASON_CODES)[number];

export interface FailoverRoutingRequest
  extends LoadBalancerRequest {
  readonly primaryWorkerName?: string;

  readonly failedWorkerNames?:
    readonly string[];

  readonly failoverStrategies?:
    readonly LoadBalancingStrategy[];

  readonly maximumAttempts?: number;

  readonly excludeAttemptedWorkers?: boolean;
}

export interface FailoverRoutingAttempt {
  readonly attemptNumber: number;

  readonly strategy:
    LoadBalancingStrategy;

  readonly excludedWorkerNames:
    readonly string[];

  readonly selectedWorkerName:
    string | null;

  readonly successful: boolean;

  readonly decision:
    LoadBalancerDecision;

  readonly attemptedAt: Date;
}

export interface FailoverRoutingResult {
  readonly selected:
    QueueWorkerRegistration | null;

  readonly selectedWorkerName:
    string | null;

  readonly reasonCode:
    FailoverRoutingReasonCode;

  readonly primaryWorkerName:
    string | null;

  readonly primarySelected: boolean;

  readonly failoverUsed: boolean;

  readonly attempts:
    readonly FailoverRoutingAttempt[];

  readonly excludedWorkerNames:
    readonly string[];

  readonly routedAt: Date;
}

export interface FailoverRoutingMetrics {
  readonly totalRoutes: number;

  readonly primarySelections: number;

  readonly failoverSelections: number;

  readonly failedRoutes: number;

  readonly totalAttempts: number;

  readonly averageAttemptsPerRoute: number;

  readonly selectionsByWorker:
    Readonly<Record<string, number>>;

  readonly attemptsByStrategy:
    Readonly<Record<LoadBalancingStrategy, number>>;

  readonly collectedAt: Date;
}

@Injectable()
export class FailoverRoutingService {
  private totalRoutes = 0;

  private primarySelections = 0;

  private failoverSelections = 0;

  private failedRoutes = 0;

  private totalAttempts = 0;

  private readonly selectionsByWorker =
    new Map<string, number>();

  private readonly attemptsByStrategy =
    new Map<LoadBalancingStrategy, number>();

  constructor(
    private readonly loadBalancer:
      LoadBalancerService,
  ) {}

  route(
    request:
      FailoverRoutingRequest,
  ): FailoverRoutingResult {
    const queueName =
      this.requireText(
        request.queueName,
        'queueName',
      );

    const primaryWorkerName =
      this.normalizeOptionalText(
        request.primaryWorkerName,
      );

    const maximumAttempts =
      this.normalizeMaximumAttempts(
        request.maximumAttempts ??
        3,
      );

    const strategies =
      this.normalizeStrategies(
        request.failoverStrategies ??
        [
          request.strategy ??
          'health_aware',
          'least_loaded',
          'round_robin',
        ],
      );

    const excludedWorkers =
      new Set(
        [
          ...(request.excludedWorkerNames ?? []),
          ...(request.failedWorkerNames ?? []),
        ]
          .map(
            (workerName) =>
              workerName.trim(),
          )
          .filter(Boolean),
      );

    const attemptedWorkers =
      new Set<string>();

    const attempts:
      FailoverRoutingAttempt[] = [];

    let selected:
      QueueWorkerRegistration | null =
        null;

    let selectedWorkerName:
      string | null = null;

    const now =
      new Date(
        request.now ??
        new Date(),
      );

    for (
      let index = 0;
      index < maximumAttempts;
      index += 1
    ) {
      const strategy =
        strategies[
          index %
          strategies.length
        ]!;

      const currentExclusions =
        new Set(excludedWorkers);

      if (
        request.excludeAttemptedWorkers ??
        true
      ) {
        for (
          const workerName
          of attemptedWorkers
        ) {
          currentExclusions.add(
            workerName,
          );
        }
      }

      const decision =
        this.loadBalancer.balance({
          ...request,
          queueName,
          strategy,
          preferredWorkerName:
            index === 0
              ? primaryWorkerName ??
                request.preferredWorkerName
              : request.preferredWorkerName,
          stickyWorkerName:
            index === 0
              ? primaryWorkerName ??
                request.stickyWorkerName
              : request.stickyWorkerName,
          preserveStickyWorker:
            Boolean(
              index === 0 &&
              primaryWorkerName,
            ),
          excludedWorkerNames: [
            ...currentExclusions,
          ],
          now,
        });

      const selectedName =
        decision.selected
          ?.workerName ??
        null;

      attempts.push({
        attemptNumber:
          index + 1,
        strategy,
        excludedWorkerNames: [
          ...currentExclusions,
        ].sort(),
        selectedWorkerName:
          selectedName,
        successful:
          Boolean(decision.selected),
        decision:
          this.cloneDecision(
            decision,
          ),
        attemptedAt:
          new Date(now),
      });

      this.totalAttempts += 1;

      this.incrementStrategyAttempt(
        strategy,
      );

      if (!decision.selected) {
        continue;
      }

      selected =
        this.cloneRegistration(
          decision.selected,
        );

      selectedWorkerName =
        decision.selected.workerName;

      attemptedWorkers.add(
        decision.selected.workerName,
      );

      break;
    }

    this.totalRoutes += 1;

    const primarySelected =
      Boolean(
        selectedWorkerName &&
        primaryWorkerName &&
        selectedWorkerName ===
          primaryWorkerName,
      );

    const failoverUsed =
      Boolean(
        selectedWorkerName &&
        (
          !primaryWorkerName ||
          selectedWorkerName !==
            primaryWorkerName
        ),
      );

    let reasonCode:
      FailoverRoutingReasonCode;

    if (primarySelected) {
      reasonCode =
        'primary_selected';

      this.primarySelections += 1;
    } else if (selected) {
      reasonCode =
        'failover_selected';

      this.failoverSelections += 1;
    } else if (
      attempts.length >=
      maximumAttempts
    ) {
      reasonCode =
        'attempts_exhausted';

      this.failedRoutes += 1;
    } else {
      reasonCode =
        'no_eligible_worker';

      this.failedRoutes += 1;
    }

    if (selectedWorkerName) {
      this.selectionsByWorker.set(
        selectedWorkerName,
        (
          this.selectionsByWorker.get(
            selectedWorkerName,
          ) ?? 0
        ) + 1,
      );
    }

    return {
      selected:
        selected
          ? this.cloneRegistration(
              selected,
            )
          : null,
      selectedWorkerName,
      reasonCode,
      primaryWorkerName,
      primarySelected,
      failoverUsed,
      attempts:
        attempts.map(
          (attempt) =>
            this.cloneAttempt(
              attempt,
            ),
        ),
      excludedWorkerNames: [
        ...excludedWorkers,
      ].sort(),
      routedAt: now,
    };
  }

  routeAfterFailure(
    request:
      Omit<
        FailoverRoutingRequest,
        'failedWorkerNames'
      >,
    failedWorkerName: string,
  ): FailoverRoutingResult {
    const normalizedWorkerName =
      this.requireText(
        failedWorkerName,
        'failedWorkerName',
      );

    return this.route({
      ...request,
      failedWorkerNames: [
        normalizedWorkerName,
      ],
      primaryWorkerName:
        request.primaryWorkerName ??
        normalizedWorkerName,
    });
  }

  getMetrics(
    collectedAt =
      new Date(),
  ): FailoverRoutingMetrics {
    const selectionsByWorker =
      Object.fromEntries(
        [...this.selectionsByWorker]
          .sort(
            ([left], [right]) =>
              left.localeCompare(
                right,
              ),
          ),
      );

    const attemptsByStrategy =
      Object.fromEntries(
        LOAD_BALANCING_STRATEGIES.map(
          (strategy) => [
            strategy,
            this.attemptsByStrategy
              .get(strategy) ?? 0,
          ],
        ),
      ) as Record<
        LoadBalancingStrategy,
        number
      >;

    return {
      totalRoutes:
        this.totalRoutes,
      primarySelections:
        this.primarySelections,
      failoverSelections:
        this.failoverSelections,
      failedRoutes:
        this.failedRoutes,
      totalAttempts:
        this.totalAttempts,
      averageAttemptsPerRoute:
        this.totalRoutes > 0
          ? this.round(
              this.totalAttempts /
              this.totalRoutes,
            )
          : 0,
      selectionsByWorker,
      attemptsByStrategy,
      collectedAt:
        new Date(collectedAt),
    };
  }

  reset(): void {
    this.totalRoutes = 0;
    this.primarySelections = 0;
    this.failoverSelections = 0;
    this.failedRoutes = 0;
    this.totalAttempts = 0;

    this.selectionsByWorker.clear();
    this.attemptsByStrategy.clear();
  }

  private normalizeStrategies(
    strategies:
      readonly LoadBalancingStrategy[],
  ): readonly LoadBalancingStrategy[] {
    const normalized =
      [
        ...new Set(strategies),
      ];

    if (normalized.length === 0) {
      throw new Error(
        'At least one failover strategy is required.',
      );
    }

    for (
      const strategy
      of normalized
    ) {
      if (
        !LOAD_BALANCING_STRATEGIES
          .includes(strategy)
      ) {
        throw new Error(
          `Unsupported failover strategy: ${strategy}.`,
        );
      }
    }

    return normalized;
  }

  private normalizeMaximumAttempts(
    value: number,
  ): number {
    if (
      !Number.isInteger(value) ||
      value < 1 ||
      value > 100
    ) {
      throw new Error(
        'maximumAttempts must be an integer between 1 and 100.',
      );
    }

    return value;
  }

  private requireText(
    value: string,
    fieldName: string,
  ): string {
    const normalized =
      value.trim();

    if (!normalized) {
      throw new Error(
        `${fieldName} is required.`,
      );
    }

    return normalized;
  }

  private normalizeOptionalText(
    value:
      string | undefined,
  ): string | null {
    if (value === undefined) {
      return null;
    }

    const normalized =
      value.trim();

    return normalized ||
      null;
  }

  private incrementStrategyAttempt(
    strategy:
      LoadBalancingStrategy,
  ): void {
    this.attemptsByStrategy.set(
      strategy,
      (
        this.attemptsByStrategy
          .get(strategy) ?? 0
      ) + 1,
    );
  }

  private round(
    value: number,
  ): number {
    return Math.round(
      value * 1000,
    ) / 1000;
  }

  private cloneRegistration(
    registration:
      QueueWorkerRegistration,
  ): QueueWorkerRegistration {
    return {
      ...registration,
    };
  }

  private cloneAttempt(
    attempt:
      FailoverRoutingAttempt,
  ): FailoverRoutingAttempt {
    return {
      ...attempt,
      excludedWorkerNames: [
        ...attempt.excludedWorkerNames,
      ],
      decision:
        this.cloneDecision(
          attempt.decision,
        ),
      attemptedAt:
        new Date(
          attempt.attemptedAt,
        ),
    };
  }

  private cloneDecision(
    decision:
      LoadBalancerDecision,
  ): LoadBalancerDecision {
    return {
      ...decision,
      selected:
        decision.selected
          ? this.cloneRegistration(
              decision.selected,
            )
          : null,
      selectedCandidate:
        decision.selectedCandidate
          ? {
              ...decision.selectedCandidate,
              capabilities: [
                ...decision
                  .selectedCandidate
                  .capabilities,
              ],
              rejectionReasons: [
                ...decision
                  .selectedCandidate
                  .rejectionReasons,
              ],
              score: {
                ...decision
                  .selectedCandidate
                  .score,
              },
              registration:
                this.cloneRegistration(
                  decision
                    .selectedCandidate
                    .registration,
                ),
            }
          : null,
      balancedAt:
        new Date(
          decision.balancedAt,
        ),
    };
  }
}