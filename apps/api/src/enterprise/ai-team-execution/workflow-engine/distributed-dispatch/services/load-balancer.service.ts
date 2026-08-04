import {
  Injectable,
} from '@nestjs/common';

import type {
  QueueWorkerRegistration,
} from '../../../../../modules/queue-infrastructure';
import {
  WorkerSelectionService,
  type WorkerSelectionCandidate,
  type WorkerSelectionRequest,
} from './worker-selection.service';

export const LOAD_BALANCING_STRATEGIES = [
  'least_loaded',
  'round_robin',
  'weighted',
  'capacity_aware',
  'health_aware',
] as const;

export type LoadBalancingStrategy =
  (typeof LOAD_BALANCING_STRATEGIES)[number];

export interface LoadBalancerWorkerWeight {
  readonly workerName: string;
  readonly weight: number;
}

export interface LoadBalancerRequest
  extends WorkerSelectionRequest {
  readonly strategy?:
    LoadBalancingStrategy;

  readonly weights?:
    readonly LoadBalancerWorkerWeight[];

  readonly stickyWorkerName?: string;

  readonly preserveStickyWorker?: boolean;
}

export interface LoadBalancerDecision {
  readonly selected:
    QueueWorkerRegistration | null;

  readonly selectedCandidate:
    WorkerSelectionCandidate | null;

  readonly strategy:
    LoadBalancingStrategy;

  readonly reason:
    string;

  readonly eligibleWorkers: number;

  readonly evaluatedWorkers: number;

  readonly sequence: number;

  readonly balancedAt: Date;
}

export interface LoadBalancerMetrics {
  readonly totalSelections: number;

  readonly successfulSelections: number;

  readonly failedSelections: number;

  readonly selectionsByStrategy:
    Readonly<Record<LoadBalancingStrategy, number>>;

  readonly selectionsByWorker:
    Readonly<Record<string, number>>;

  readonly lastSelectedWorkerName:
    string | null;

  readonly collectedAt: Date;
}

@Injectable()
export class LoadBalancerService {
  private readonly roundRobinCursorByQueue =
    new Map<string, number>();

  private readonly workerSelectionCounts =
    new Map<string, number>();

  private readonly strategySelectionCounts =
    new Map<LoadBalancingStrategy, number>();

  private totalSelections = 0;

  private successfulSelections = 0;

  private failedSelections = 0;

  private lastSelectedWorkerName:
    string | null = null;

  constructor(
    private readonly workerSelection:
      WorkerSelectionService,
  ) {}

  balance(
    request:
      LoadBalancerRequest,
  ): LoadBalancerDecision {
    const strategy =
      request.strategy ??
      'least_loaded';

    this.assertStrategy(
      strategy,
    );

    const candidates =
      this.workerSelection
        .rank(request)
        .filter(
          (candidate) =>
            candidate.eligible,
        );

    const selectedCandidate =
      this.selectCandidate(
        strategy,
        candidates,
        request,
      );

    this.totalSelections += 1;

    this.incrementStrategyCount(
      strategy,
    );

    if (selectedCandidate) {
      this.successfulSelections += 1;

      this.lastSelectedWorkerName =
        selectedCandidate.workerName;

      this.workerSelectionCounts.set(
        selectedCandidate.workerName,
        (
          this.workerSelectionCounts.get(
            selectedCandidate.workerName,
          ) ?? 0
        ) + 1,
      );
    } else {
      this.failedSelections += 1;
    }

    return {
      selected:
        selectedCandidate
          ? {
              ...selectedCandidate.registration,
            }
          : null,

      selectedCandidate:
        selectedCandidate
          ? this.cloneCandidate(
              selectedCandidate,
            )
          : null,

      strategy,

      reason:
        selectedCandidate
          ? `Selected ${selectedCandidate.workerName} using ${strategy}.`
          : 'No eligible worker was available.',

      eligibleWorkers:
        candidates.length,

      evaluatedWorkers:
        this.workerSelection
          .rank(request)
          .length,

      sequence:
        this.totalSelections,

      balancedAt:
        new Date(
          request.now ??
          new Date(),
        ),
    };
  }

  getMetrics(
    collectedAt =
      new Date(),
  ): LoadBalancerMetrics {
    const selectionsByStrategy =
      Object.fromEntries(
        LOAD_BALANCING_STRATEGIES.map(
          (strategy) => [
            strategy,
            this.strategySelectionCounts
              .get(strategy) ?? 0,
          ],
        ),
      ) as Record<
        LoadBalancingStrategy,
        number
      >;

    const selectionsByWorker =
      Object.fromEntries(
        [...this.workerSelectionCounts]
          .sort(
            ([left], [right]) =>
              left.localeCompare(right),
          ),
      );

    return {
      totalSelections:
        this.totalSelections,

      successfulSelections:
        this.successfulSelections,

      failedSelections:
        this.failedSelections,

      selectionsByStrategy,

      selectionsByWorker,

      lastSelectedWorkerName:
        this.lastSelectedWorkerName,

      collectedAt:
        new Date(collectedAt),
    };
  }

  reset(): void {
    this.roundRobinCursorByQueue
      .clear();

    this.workerSelectionCounts
      .clear();

    this.strategySelectionCounts
      .clear();

    this.totalSelections = 0;
    this.successfulSelections = 0;
    this.failedSelections = 0;
    this.lastSelectedWorkerName = null;
  }

  private selectCandidate(
    strategy:
      LoadBalancingStrategy,

    candidates:
      readonly WorkerSelectionCandidate[],

    request:
      LoadBalancerRequest,
  ): WorkerSelectionCandidate | null {
    if (candidates.length === 0) {
      return null;
    }

    const stickyCandidate =
      this.resolveStickyCandidate(
        candidates,
        request,
      );

    if (stickyCandidate) {
      return stickyCandidate;
    }

    switch (strategy) {
      case 'round_robin':
        return this.selectRoundRobin(
          request.queueName,
          candidates,
        );

      case 'weighted':
        return this.selectWeighted(
          candidates,
          request.weights ?? [],
        );

      case 'capacity_aware':
        return this.selectCapacityAware(
          candidates,
        );

      case 'health_aware':
        return this.selectHealthAware(
          candidates,
        );

      case 'least_loaded':
      default:
        return this.selectLeastLoaded(
          candidates,
        );
    }
  }

  private resolveStickyCandidate(
    candidates:
      readonly WorkerSelectionCandidate[],

    request:
      LoadBalancerRequest,
  ): WorkerSelectionCandidate | null {
    if (
      !request.preserveStickyWorker ||
      !request.stickyWorkerName
    ) {
      return null;
    }

    return candidates.find(
      (candidate) =>
        candidate.workerName ===
        request.stickyWorkerName,
    ) ?? null;
  }

  private selectLeastLoaded(
    candidates:
      readonly WorkerSelectionCandidate[],
  ): WorkerSelectionCandidate {
    return [...candidates]
      .sort(
        (left, right) => {
          if (
            left.utilizationRatio !==
            right.utilizationRatio
          ) {
            return (
              left.utilizationRatio -
              right.utilizationRatio
            );
          }

          if (
            left.availableSlots !==
            right.availableSlots
          ) {
            return (
              right.availableSlots -
              left.availableSlots
            );
          }

          return left.workerName
            .localeCompare(
              right.workerName,
            );
        },
      )[0]!;
  }

  private selectRoundRobin(
    queueName: string,
    candidates:
      readonly WorkerSelectionCandidate[],
  ): WorkerSelectionCandidate {
    const ordered =
      [...candidates].sort(
        (left, right) =>
          left.workerName.localeCompare(
            right.workerName,
          ),
      );

    const cursor =
      this.roundRobinCursorByQueue
        .get(queueName) ?? 0;

    const index =
      cursor %
      ordered.length;

    this.roundRobinCursorByQueue.set(
      queueName,
      (index + 1) %
      ordered.length,
    );

    return ordered[index]!;
  }

  private selectWeighted(
    candidates:
      readonly WorkerSelectionCandidate[],

    weights:
      readonly LoadBalancerWorkerWeight[],
  ): WorkerSelectionCandidate {
    const weightByWorker =
      new Map(
        weights.map(
          (item) => [
            item.workerName,
            this.normalizeWeight(
              item.weight,
            ),
          ],
        ),
      );

    return [...candidates]
      .sort(
        (left, right) => {
          const leftWeight =
            weightByWorker.get(
              left.workerName,
            ) ?? 1;

          const rightWeight =
            weightByWorker.get(
              right.workerName,
            ) ?? 1;

          const leftSelections =
            this.workerSelectionCounts.get(
              left.workerName,
            ) ?? 0;

          const rightSelections =
            this.workerSelectionCounts.get(
              right.workerName,
            ) ?? 0;

          const leftRatio =
            leftSelections /
            leftWeight;

          const rightRatio =
            rightSelections /
            rightWeight;

          if (
            leftRatio !==
            rightRatio
          ) {
            return (
              leftRatio -
              rightRatio
            );
          }

          if (
            leftWeight !==
            rightWeight
          ) {
            return (
              rightWeight -
              leftWeight
            );
          }

          return left.workerName
            .localeCompare(
              right.workerName,
            );
        },
      )[0]!;
  }

  private selectCapacityAware(
    candidates:
      readonly WorkerSelectionCandidate[],
  ): WorkerSelectionCandidate {
    return [...candidates]
      .sort(
        (left, right) => {
          if (
            left.availableSlots !==
            right.availableSlots
          ) {
            return (
              right.availableSlots -
              left.availableSlots
            );
          }

          if (
            left.concurrency !==
            right.concurrency
          ) {
            return (
              right.concurrency -
              left.concurrency
            );
          }

          return left.workerName
            .localeCompare(
              right.workerName,
            );
        },
      )[0]!;
  }

  private selectHealthAware(
    candidates:
      readonly WorkerSelectionCandidate[],
  ): WorkerSelectionCandidate {
    return [...candidates]
      .sort(
        (left, right) => {
          if (
            left.score.healthScore !==
            right.score.healthScore
          ) {
            return (
              right.score.healthScore -
              left.score.healthScore
            );
          }

          if (
            left.score.reliabilityScore !==
            right.score.reliabilityScore
          ) {
            return (
              right.score.reliabilityScore -
              left.score.reliabilityScore
            );
          }

          if (
            left.score.totalScore !==
            right.score.totalScore
          ) {
            return (
              right.score.totalScore -
              left.score.totalScore
            );
          }

          return left.workerName
            .localeCompare(
              right.workerName,
            );
        },
      )[0]!;
  }

  private assertStrategy(
    strategy:
      LoadBalancingStrategy,
  ): void {
    if (
      !LOAD_BALANCING_STRATEGIES
        .includes(strategy)
    ) {
      throw new Error(
        `Unsupported load-balancing strategy: ${strategy}.`,
      );
    }
  }

  private normalizeWeight(
    value: number,
  ): number {
    if (
      !Number.isFinite(value) ||
      value <= 0
    ) {
      throw new Error(
        'Worker weight must be a positive number.',
      );
    }

    return value;
  }

  private incrementStrategyCount(
    strategy:
      LoadBalancingStrategy,
  ): void {
    this.strategySelectionCounts.set(
      strategy,
      (
        this.strategySelectionCounts
          .get(strategy) ?? 0
      ) + 1,
    );
  }

  private cloneCandidate(
    candidate:
      WorkerSelectionCandidate,
  ): WorkerSelectionCandidate {
    return {
      ...candidate,

      capabilities: [
        ...candidate.capabilities,
      ],

      rejectionReasons: [
        ...candidate.rejectionReasons,
      ],

      score: {
        ...candidate.score,
      },

      registration: {
        ...candidate.registration,
      },
    };
  }
}