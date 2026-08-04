import {
  Injectable,
} from '@nestjs/common';

import type {
  QueueWorkerRegistration,
} from '../../../../../modules/queue-infrastructure';
import {
  LoadBalancerService,
  type LoadBalancerDecision,
} from './load-balancer.service';
import type {
  WorkerSelectionRuntimeSnapshot,
} from './worker-selection.service';
import {
  WorkerDrainingService,
} from './worker-draining.service';

export const WORKER_HEALTH_LEVELS = [
  'healthy',
  'degraded',
  'unhealthy',
] as const;

export type WorkerHealthLevel =
  (typeof WORKER_HEALTH_LEVELS)[number];

export interface HealthSchedulingPolicy {
  readonly healthyThreshold: number;
  readonly degradedThreshold: number;
  readonly maximumHeartbeatAgeMs: number;
  readonly minimumAvailableSlots: number;
  readonly allowDegraded: boolean;
  readonly excludeDrainingWorkers: boolean;
}

export interface WorkerHealthEvaluation {
  readonly workerName: string;
  readonly level: WorkerHealthLevel;
  readonly healthScore: number;
  readonly capacityScore: number;
  readonly reliabilityScore: number;
  readonly heartbeatScore: number;
  readonly activeJobs: number;
  readonly availableSlots: number;
  readonly heartbeatAgeMs: number | null;
  readonly draining: boolean;
  readonly eligible: boolean;
  readonly reasons: readonly string[];
  readonly evaluatedAt: Date;
}

export interface HealthSchedulingRequest {
  readonly queueName: string;
  readonly runtimeSnapshots:
    readonly WorkerSelectionRuntimeSnapshot[];
  readonly policy?:
    Partial<HealthSchedulingPolicy>;
  readonly requiredCapabilities?:
    readonly string[];
  readonly excludedWorkerNames?:
    readonly string[];
  readonly preferredWorkerName?: string;
  readonly now?: Date;
}

export interface HealthSchedulingResult {
  readonly selected:
    QueueWorkerRegistration | null;
  readonly decision:
    LoadBalancerDecision;
  readonly evaluations:
    readonly WorkerHealthEvaluation[];
  readonly eligibleWorkers: number;
  readonly healthyWorkers: number;
  readonly degradedWorkers: number;
  readonly unhealthyWorkers: number;
  readonly scheduledAt: Date;
}

export interface HealthSchedulingMetrics {
  readonly totalSchedules: number;
  readonly successfulSchedules: number;
  readonly failedSchedules: number;
  readonly healthySelections: number;
  readonly degradedSelections: number;
  readonly workerSelections:
    Readonly<Record<string, number>>;
  readonly collectedAt: Date;
}

const DEFAULT_POLICY:
  HealthSchedulingPolicy = {
    healthyThreshold: 0.75,
    degradedThreshold: 0.4,
    maximumHeartbeatAgeMs: 60_000,
    minimumAvailableSlots: 1,
    allowDegraded: false,
    excludeDrainingWorkers: true,
  };

@Injectable()
export class HealthBasedSchedulingService {
  private totalSchedules = 0;

  private successfulSchedules = 0;

  private failedSchedules = 0;

  private healthySelections = 0;

  private degradedSelections = 0;

  private readonly workerSelections =
    new Map<string, number>();

  constructor(
    private readonly loadBalancer:
      LoadBalancerService,

    private readonly draining:
      WorkerDrainingService,
  ) {}

  schedule(
    request:
      HealthSchedulingRequest,
  ): HealthSchedulingResult {
    const queueName =
      this.requireText(
        request.queueName,
        'queueName',
      );

    const now =
      new Date(
        request.now ??
        new Date(),
      );

    const policy =
      this.normalizePolicy(
        request.policy,
      );

    const evaluations =
      request.runtimeSnapshots
        .map(
          (snapshot) =>
            this.evaluate(
              snapshot,
              policy,
              now,
            ),
        )
        .sort(
          (left, right) => {
            if (
              left.eligible !==
              right.eligible
            ) {
              return left.eligible
                ? -1
                : 1;
            }

            if (
              left.healthScore !==
              right.healthScore
            ) {
              return (
                right.healthScore -
                left.healthScore
              );
            }

            return left.workerName.localeCompare(
              right.workerName,
            );
          },
        );

    const excludedWorkers =
      new Set(
        (
          request.excludedWorkerNames ??
          []
        )
          .map(
            (workerName) =>
              workerName.trim(),
          )
          .filter(Boolean),
      );

    for (const evaluation of evaluations) {
      if (!evaluation.eligible) {
        excludedWorkers.add(
          evaluation.workerName,
        );
      }
    }

    const adjustedSnapshots =
      request.runtimeSnapshots.map(
        (snapshot) => {
          const evaluation =
            evaluations.find(
              (candidate) =>
                candidate.workerName ===
                snapshot.workerName,
            );

          return {
            ...snapshot,
            healthScore:
              evaluation?.healthScore ??
              snapshot.healthScore,
            status:
              evaluation?.level ??
              snapshot.status,
          };
        },
      );

    const decision =
      this.loadBalancer.balance({
        queueName,
        strategy: 'health_aware',
        runtimeSnapshots:
          adjustedSnapshots,
        excludedWorkerNames: [
          ...excludedWorkers,
        ],
        requiredCapabilities:
          request.requiredCapabilities,
        preferredWorkerName:
          request.preferredWorkerName,
        minimumAvailableSlots:
          policy.minimumAvailableSlots,
        allowDegraded:
          policy.allowDegraded,
        maximumHeartbeatAgeMs:
          policy.maximumHeartbeatAgeMs,
        now,
      });

    this.totalSchedules += 1;

    if (decision.selected) {
      this.successfulSchedules += 1;

      const selectedEvaluation =
        evaluations.find(
          (evaluation) =>
            evaluation.workerName ===
            decision.selected?.workerName,
        );

      if (
        selectedEvaluation?.level ===
        'healthy'
      ) {
        this.healthySelections += 1;
      } else if (
        selectedEvaluation?.level ===
        'degraded'
      ) {
        this.degradedSelections += 1;
      }

      const workerName =
        decision.selected.workerName;

      this.workerSelections.set(
        workerName,
        (
          this.workerSelections.get(
            workerName,
          ) ?? 0
        ) + 1,
      );
    } else {
      this.failedSchedules += 1;
    }

    return {
      selected:
        decision.selected
          ? {
              ...decision.selected,
            }
          : null,
      decision:
        this.cloneDecision(
          decision,
        ),
      evaluations:
        evaluations.map(
          (evaluation) =>
            this.cloneEvaluation(
              evaluation,
            ),
        ),
      eligibleWorkers:
        evaluations.filter(
          (evaluation) =>
            evaluation.eligible,
        ).length,
      healthyWorkers:
        evaluations.filter(
          (evaluation) =>
            evaluation.level ===
            'healthy',
        ).length,
      degradedWorkers:
        evaluations.filter(
          (evaluation) =>
            evaluation.level ===
            'degraded',
        ).length,
      unhealthyWorkers:
        evaluations.filter(
          (evaluation) =>
            evaluation.level ===
            'unhealthy',
        ).length,
      scheduledAt: now,
    };
  }

  evaluate(
    snapshot:
      WorkerSelectionRuntimeSnapshot,
    policy:
      HealthSchedulingPolicy =
        DEFAULT_POLICY,
    now =
      new Date(),
  ): WorkerHealthEvaluation {
    const workerName =
      this.requireText(
        snapshot.workerName,
        'workerName',
      );

    const normalizedPolicy =
      this.normalizePolicy(
        policy,
      );

    const evaluatedAt =
      new Date(now);

    const activeJobs =
      this.normalizeCount(
        snapshot.activeJobs,
      );

    const concurrency =
      this.resolveConcurrency(
        snapshot,
      );

    const availableSlots =
      Math.max(
        0,
        concurrency -
        activeJobs,
      );

    const capacityScore =
      concurrency > 0
        ? this.clamp(
            availableSlots /
            concurrency,
          )
        : 0;

    const completedJobs =
      this.normalizeCount(
        snapshot.completedJobs,
      );

    const failedJobs =
      this.normalizeCount(
        snapshot.failedJobs,
      );

    const completedTotal =
      completedJobs +
      failedJobs;

    const reliabilityScore =
      completedTotal === 0
        ? 1
        : this.clamp(
            completedJobs /
            completedTotal,
          );

    const heartbeatAgeMs =
      snapshot.lastHeartbeatAt
        ? Math.max(
            0,
            evaluatedAt.getTime() -
            snapshot.lastHeartbeatAt
              .getTime(),
          )
        : null;

    const heartbeatScore =
      heartbeatAgeMs === null
        ? 0.5
        : this.clamp(
            1 -
            heartbeatAgeMs /
            normalizedPolicy
              .maximumHeartbeatAgeMs,
          );

    const healthScore =
      this.round(
        (
          capacityScore * 0.4
        ) +
        (
          reliabilityScore * 0.35
        ) +
        (
          heartbeatScore * 0.25
        ),
      );

    let level:
      WorkerHealthLevel;

    if (
      healthScore >=
      normalizedPolicy
        .healthyThreshold
    ) {
      level = 'healthy';
    } else if (
      healthScore >=
      normalizedPolicy
        .degradedThreshold
    ) {
      level = 'degraded';
    } else {
      level = 'unhealthy';
    }

    const draining =
      this.draining.isDraining(
        workerName,
      );

    const reasons:
      string[] = [];

    if (
      availableSlots <
      normalizedPolicy
        .minimumAvailableSlots
    ) {
      reasons.push(
        'insufficient_capacity',
      );
    }

    if (
      heartbeatAgeMs !== null &&
      heartbeatAgeMs >
      normalizedPolicy
        .maximumHeartbeatAgeMs
    ) {
      reasons.push(
        'heartbeat_expired',
      );
    }

    if (
      level === 'unhealthy'
    ) {
      reasons.push(
        'worker_unhealthy',
      );
    }

    if (
      level === 'degraded' &&
      !normalizedPolicy
        .allowDegraded
    ) {
      reasons.push(
        'degraded_not_allowed',
      );
    }

    if (
      draining &&
      normalizedPolicy
        .excludeDrainingWorkers
    ) {
      reasons.push(
        'worker_draining',
      );
    }

    return {
      workerName,
      level,
      healthScore,
      capacityScore:
        this.round(
          capacityScore,
        ),
      reliabilityScore:
        this.round(
          reliabilityScore,
        ),
      heartbeatScore:
        this.round(
          heartbeatScore,
        ),
      activeJobs,
      availableSlots,
      heartbeatAgeMs,
      draining,
      eligible:
        reasons.length === 0,
      reasons,
      evaluatedAt,
    };
  }

  getMetrics(
    collectedAt =
      new Date(),
  ): HealthSchedulingMetrics {
    return {
      totalSchedules:
        this.totalSchedules,
      successfulSchedules:
        this.successfulSchedules,
      failedSchedules:
        this.failedSchedules,
      healthySelections:
        this.healthySelections,
      degradedSelections:
        this.degradedSelections,
      workerSelections:
        Object.fromEntries(
          [...this.workerSelections]
            .sort(
              ([left], [right]) =>
                left.localeCompare(
                  right,
                ),
            ),
        ),
      collectedAt:
        new Date(
          collectedAt,
        ),
    };
  }

  reset(): void {
    this.totalSchedules = 0;
    this.successfulSchedules = 0;
    this.failedSchedules = 0;
    this.healthySelections = 0;
    this.degradedSelections = 0;
    this.workerSelections.clear();
  }

  private normalizePolicy(
    input:
      Partial<HealthSchedulingPolicy> |
      HealthSchedulingPolicy |
      undefined,
  ): HealthSchedulingPolicy {
    const policy:
      HealthSchedulingPolicy = {
      ...DEFAULT_POLICY,
      ...input,
    };

    this.assertProbability(
      policy.healthyThreshold,
      'healthyThreshold',
    );

    this.assertProbability(
      policy.degradedThreshold,
      'degradedThreshold',
    );

    if (
      policy.degradedThreshold >
      policy.healthyThreshold
    ) {
      throw new Error(
        'degradedThreshold cannot exceed healthyThreshold.',
      );
    }

    if (
      !Number.isInteger(
        policy.maximumHeartbeatAgeMs,
      ) ||
      policy.maximumHeartbeatAgeMs <= 0
    ) {
      throw new Error(
        'maximumHeartbeatAgeMs must be a positive integer.',
      );
    }

    if (
      !Number.isInteger(
        policy.minimumAvailableSlots,
      ) ||
      policy.minimumAvailableSlots < 0
    ) {
      throw new Error(
        'minimumAvailableSlots must be a non-negative integer.',
      );
    }

    return policy;
  }

  private resolveConcurrency(
    snapshot:
      WorkerSelectionRuntimeSnapshot,
  ): number {
    const metadataConcurrency =
      snapshot.capabilities
        ?.find(
          (capability) =>
            capability.startsWith(
              'concurrency:',
            ),
        );

    if (!metadataConcurrency) {
      return Math.max(
        1,
        snapshot.activeJobs + 1,
      );
    }

    const parsed =
      Number(
        metadataConcurrency.slice(
          'concurrency:'.length,
        ),
      );

    return (
      Number.isInteger(parsed) &&
      parsed > 0
    )
      ? parsed
      : Math.max(
          1,
          snapshot.activeJobs + 1,
        );
  }

  private normalizeCount(
    value: number,
  ): number {
    if (
      !Number.isFinite(value) ||
      value < 0
    ) {
      return 0;
    }

    return Math.floor(value);
  }

  private assertProbability(
    value: number,
    fieldName: string,
  ): void {
    if (
      !Number.isFinite(value) ||
      value < 0 ||
      value > 1
    ) {
      throw new Error(
        `${fieldName} must be between 0 and 1.`,
      );
    }
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

  private clamp(
    value: number,
  ): number {
    return Math.max(
      0,
      Math.min(
        1,
        value,
      ),
    );
  }

  private round(
    value: number,
  ): number {
    return Math.round(
      value * 1000,
    ) / 1000;
  }

  private cloneEvaluation(
    evaluation:
      WorkerHealthEvaluation,
  ): WorkerHealthEvaluation {
    return {
      ...evaluation,
      reasons: [
        ...evaluation.reasons,
      ],
      evaluatedAt:
        new Date(
          evaluation.evaluatedAt,
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
          ? {
              ...decision.selected,
            }
          : null,
      selectedCandidate:
        decision.selectedCandidate
          ? {
              ...decision
                .selectedCandidate,
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
              registration: {
                ...decision
                  .selectedCandidate
                  .registration,
              },
            }
          : null,
      balancedAt:
        new Date(
          decision.balancedAt,
        ),
    };
  }
}