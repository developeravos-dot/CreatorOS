import {
  Injectable,
} from '@nestjs/common';

import type {
  QueueWorkerRegistration,
} from '../../../../../modules/queue-infrastructure';
import {
  QueueWorkerRegistryService,
} from '../../../../../modules/queue-infrastructure';

export const WORKER_SELECTION_REASON_CODES = [
  'selected',
  'no_registered_workers',
  'no_queue_compatible_workers',
  'no_eligible_workers',
] as const;

export type WorkerSelectionReasonCode =
  (typeof WORKER_SELECTION_REASON_CODES)[number];

export type WorkerSelectionHealthStatus =
  | 'healthy'
  | 'degraded'
  | 'unhealthy'
  | 'unknown';

export interface WorkerSelectionRuntimeSnapshot {
  readonly workerName: string;
  readonly status:
    WorkerSelectionHealthStatus;
  readonly activeJobs: number;
  readonly completedJobs: number;
  readonly failedJobs: number;
  readonly healthScore?: number;
  readonly capabilities?:
    readonly string[];
  readonly lastHeartbeatAt?: Date;
}

export interface WorkerSelectionRequest {
  readonly queueName: string;
  readonly requiredCapabilities?:
    readonly string[];
  readonly excludedWorkerNames?:
    readonly string[];
  readonly preferredWorkerName?: string;
  readonly affinityWorkerName?: string;
  readonly minimumAvailableSlots?: number;
  readonly allowDegraded?: boolean;
  readonly maximumHeartbeatAgeMs?: number;
  readonly now?: Date;
  readonly runtimeSnapshots?:
    readonly WorkerSelectionRuntimeSnapshot[];
}

export interface WorkerSelectionScoreBreakdown {
  readonly capacityScore: number;
  readonly healthScore: number;
  readonly reliabilityScore: number;
  readonly affinityScore: number;
  readonly preferenceScore: number;
  readonly totalScore: number;
}

export interface WorkerSelectionCandidate {
  readonly workerName: string;
  readonly queueName: string;
  readonly concurrency: number;
  readonly activeJobs: number;
  readonly availableSlots: number;
  readonly utilizationRatio: number;
  readonly status:
    WorkerSelectionHealthStatus;
  readonly capabilities:
    readonly string[];
  readonly eligible: boolean;
  readonly rejectionReasons:
    readonly string[];
  readonly score:
    WorkerSelectionScoreBreakdown;
  readonly registration:
    QueueWorkerRegistration;
}

export interface WorkerSelectionResult {
  readonly selected:
    QueueWorkerRegistration | null;
  readonly selectedCandidate:
    WorkerSelectionCandidate | null;
  readonly reasonCode:
    WorkerSelectionReasonCode;
  readonly candidates:
    readonly WorkerSelectionCandidate[];
  readonly evaluatedWorkers: number;
  readonly eligibleWorkers: number;
  readonly selectedAt: Date;
}

@Injectable()
export class WorkerSelectionService {
  constructor(
    private readonly registry:
      QueueWorkerRegistryService,
  ) {}

  select(
    request:
      WorkerSelectionRequest,
  ): WorkerSelectionResult {
    const queueName =
      this.requireText(
        request.queueName,
        'queueName',
      );

    const allWorkers =
      this.registry.list();

    const queueWorkers =
      allWorkers.filter(
        (worker) =>
          worker.queueName ===
          queueName,
      );

    const candidates =
      this.rank({
        ...request,
        queueName,
      });

    const selectedCandidate =
      candidates.find(
        (candidate) =>
          candidate.eligible,
      ) ?? null;

    let reasonCode:
      WorkerSelectionReasonCode =
        'selected';

    if (allWorkers.length === 0) {
      reasonCode =
        'no_registered_workers';
    } else if (
      queueWorkers.length === 0
    ) {
      reasonCode =
        'no_queue_compatible_workers';
    } else if (!selectedCandidate) {
      reasonCode =
        'no_eligible_workers';
    }

    return {
      selected:
        selectedCandidate
          ? this.cloneRegistration(
              selectedCandidate.registration,
            )
          : null,
      selectedCandidate:
        selectedCandidate
          ? this.cloneCandidate(
              selectedCandidate,
            )
          : null,
      reasonCode,
      candidates:
        candidates.map(
          (candidate) =>
            this.cloneCandidate(
              candidate,
            ),
        ),
      evaluatedWorkers:
        candidates.length,
      eligibleWorkers:
        candidates.filter(
          (candidate) =>
            candidate.eligible,
        ).length,
      selectedAt:
        new Date(
          request.now ??
          new Date(),
        ),
    };
  }

  rank(
    request:
      WorkerSelectionRequest,
  ): readonly WorkerSelectionCandidate[] {
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

    const minimumAvailableSlots =
      this.normalizeNonNegativeInteger(
        request.minimumAvailableSlots ??
        1,
        'minimumAvailableSlots',
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

    const requiredCapabilities =
      this.normalizeCapabilities(
        request.requiredCapabilities ??
        [],
      );

    const runtimeByWorker =
      new Map(
        (
          request.runtimeSnapshots ??
          []
        ).map(
          (snapshot) => [
            snapshot.workerName,
            snapshot,
          ],
        ),
      );

    return this.registry
      .list()
      .filter(
        (registration) =>
          registration.queueName ===
          queueName,
      )
      .map(
        (registration) =>
          this.evaluateCandidate(
            registration,
            runtimeByWorker.get(
              registration.workerName,
            ),
            {
              ...request,
              queueName,
              minimumAvailableSlots,
              requiredCapabilities,
              excludedWorkers,
              now,
            },
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
            left.score.totalScore !==
            right.score.totalScore
          ) {
            return (
              right.score.totalScore -
              left.score.totalScore
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
      )
      .map(
        (candidate) =>
          this.cloneCandidate(
            candidate,
          ),
      );
  }

  isEligible(
    registration:
      QueueWorkerRegistration,
    request:
      WorkerSelectionRequest,
    runtimeSnapshot?:
      WorkerSelectionRuntimeSnapshot,
  ): boolean {
    const queueName =
      this.requireText(
        request.queueName,
        'queueName',
      );

    if (
      registration.queueName !==
      queueName
    ) {
      return false;
    }

    const candidate =
      this.evaluateCandidate(
        registration,
        runtimeSnapshot,
        {
          ...request,
          queueName,
          minimumAvailableSlots:
            this.normalizeNonNegativeInteger(
              request.minimumAvailableSlots ??
              1,
              'minimumAvailableSlots',
            ),
          requiredCapabilities:
            this.normalizeCapabilities(
              request.requiredCapabilities ??
              [],
            ),
          excludedWorkers:
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
            ),
          now:
            new Date(
              request.now ??
              new Date(),
            ),
        },
      );

    return candidate.eligible;
  }

  private evaluateCandidate(
    registration:
      QueueWorkerRegistration,
    runtime:
      WorkerSelectionRuntimeSnapshot |
      undefined,
    context: WorkerSelectionRequest & {
      readonly minimumAvailableSlots:
        number;
      readonly requiredCapabilities:
        readonly string[];
      readonly excludedWorkers:
        ReadonlySet<string>;
      readonly now: Date;
    },
  ): WorkerSelectionCandidate {
    const rejectionReasons:
      string[] = [];

    const activeJobs =
      this.normalizeRuntimeCount(
        runtime?.activeJobs ??
        0,
      );

    const availableSlots =
      Math.max(
        0,
        registration.concurrency -
        activeJobs,
      );

    const utilizationRatio =
      registration.concurrency > 0
        ? Math.min(
            1,
            activeJobs /
            registration.concurrency,
          )
        : 1;

    const status =
      runtime?.status ??
      'unknown';

    const capabilities =
      this.normalizeCapabilities(
        runtime?.capabilities ??
        [],
      );

    if (
      context.excludedWorkers.has(
        registration.workerName,
      )
    ) {
      rejectionReasons.push(
        'worker_excluded',
      );
    }

    if (
      registration.concurrency < 1
    ) {
      rejectionReasons.push(
        'invalid_concurrency',
      );
    }

    if (
      availableSlots <
      context.minimumAvailableSlots
    ) {
      rejectionReasons.push(
        'insufficient_capacity',
      );
    }

    if (
      status === 'unhealthy'
    ) {
      rejectionReasons.push(
        'worker_unhealthy',
      );
    }

    if (
      status === 'degraded' &&
      !context.allowDegraded
    ) {
      rejectionReasons.push(
        'degraded_not_allowed',
      );
    }

    if (
      context.maximumHeartbeatAgeMs !==
        undefined &&
      runtime?.lastHeartbeatAt
    ) {
      const heartbeatAgeMs =
        context.now.getTime() -
        runtime.lastHeartbeatAt
          .getTime();

      if (
        heartbeatAgeMs >
        context.maximumHeartbeatAgeMs
      ) {
        rejectionReasons.push(
          'heartbeat_expired',
        );
      }
    }

    const missingCapabilities =
      context.requiredCapabilities
        .filter(
          (capability) =>
            !capabilities.includes(
              capability,
            ),
        );

    if (
      missingCapabilities.length > 0
    ) {
      rejectionReasons.push(
        `missing_capabilities:${missingCapabilities.join(',')}`,
      );
    }

    const score =
      this.calculateScore(
        registration,
        runtime,
        {
          availableSlots,
          utilizationRatio,
          preferredWorkerName:
            context.preferredWorkerName,
          affinityWorkerName:
            context.affinityWorkerName,
        },
      );

    return {
      workerName:
        registration.workerName,
      queueName:
        registration.queueName,
      concurrency:
        registration.concurrency,
      activeJobs,
      availableSlots,
      utilizationRatio,
      status,
      capabilities,
      eligible:
        rejectionReasons.length === 0,
      rejectionReasons,
      score,
      registration:
        this.cloneRegistration(
          registration,
        ),
    };
  }

  private calculateScore(
    registration:
      QueueWorkerRegistration,
    runtime:
      WorkerSelectionRuntimeSnapshot |
      undefined,
    input: {
      readonly availableSlots: number;
      readonly utilizationRatio: number;
      readonly preferredWorkerName?:
        string;
      readonly affinityWorkerName?:
        string;
    },
  ): WorkerSelectionScoreBreakdown {
    const capacityScore =
      registration.concurrency > 0
        ? (
            input.availableSlots /
            registration.concurrency
          ) * 50
        : 0;

    const healthScore =
      this.resolveHealthScore(
        runtime,
      ) * 25;

    const reliabilityScore =
      this.resolveReliabilityScore(
        runtime,
      ) * 15;

    const affinityScore =
      input.affinityWorkerName ===
      registration.workerName
        ? 7
        : 0;

    const preferenceScore =
      input.preferredWorkerName ===
      registration.workerName
        ? 3
        : 0;

    const totalScore =
      capacityScore +
      healthScore +
      reliabilityScore +
      affinityScore +
      preferenceScore;

    return {
      capacityScore:
        this.roundScore(
          capacityScore,
        ),
      healthScore:
        this.roundScore(
          healthScore,
        ),
      reliabilityScore:
        this.roundScore(
          reliabilityScore,
        ),
      affinityScore,
      preferenceScore,
      totalScore:
        this.roundScore(
          totalScore,
        ),
    };
  }

  private resolveHealthScore(
    runtime:
      WorkerSelectionRuntimeSnapshot |
      undefined,
  ): number {
    if (
      runtime?.healthScore !==
      undefined
    ) {
      return Math.max(
        0,
        Math.min(
          1,
          runtime.healthScore,
        ),
      );
    }

    switch (runtime?.status) {
      case 'healthy':
        return 1;

      case 'degraded':
        return 0.5;

      case 'unhealthy':
        return 0;

      default:
        return 0.75;
    }
  }

  private resolveReliabilityScore(
    runtime:
      WorkerSelectionRuntimeSnapshot |
      undefined,
  ): number {
    if (!runtime) {
      return 0.75;
    }

    const completedJobs =
      this.normalizeRuntimeCount(
        runtime.completedJobs,
      );

    const failedJobs =
      this.normalizeRuntimeCount(
        runtime.failedJobs,
      );

    const totalFinished =
      completedJobs +
      failedJobs;

    if (totalFinished === 0) {
      return 1;
    }

    return completedJobs /
      totalFinished;
  }

  private normalizeCapabilities(
    capabilities:
      readonly string[],
  ): readonly string[] {
    return [
      ...new Set(
        capabilities
          .map(
            (capability) =>
              capability
                .trim()
                .toLowerCase(),
          )
          .filter(Boolean),
      ),
    ].sort();
  }

  private normalizeNonNegativeInteger(
    value: number,
    fieldName: string,
  ): number {
    if (
      !Number.isInteger(value) ||
      value < 0
    ) {
      throw new Error(
        `${fieldName} must be a non-negative integer.`,
      );
    }

    return value;
  }

  private normalizeRuntimeCount(
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

  private roundScore(
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
      registration:
        this.cloneRegistration(
          candidate.registration,
        ),
    };
  }
}