import {
  Injectable,
} from '@nestjs/common';

export const REBALANCING_ACTION_TYPES = [
  'move',
  'none',
] as const;

export type RebalancingActionType =
  (typeof REBALANCING_ACTION_TYPES)[number];

export interface RebalancingWorkerSnapshot {
  readonly workerName: string;
  readonly queueName: string;
  readonly concurrency: number;
  readonly activeJobs: number;
  readonly healthScore: number;
  readonly draining: boolean;
}

export interface DynamicRebalancingPolicy {
  readonly overloadThreshold: number;
  readonly underloadThreshold: number;
  readonly minimumHealthScore: number;
  readonly maximumMovesPerCycle: number;
  readonly preserveMinimumJobs: number;
}

export interface DynamicRebalancingRequest {
  readonly queueName: string;
  readonly workers:
    readonly RebalancingWorkerSnapshot[];
  readonly policy?:
    Partial<DynamicRebalancingPolicy>;
  readonly now?: Date;
}

export interface RebalancingAction {
  readonly type:
    RebalancingActionType;
  readonly queueName: string;
  readonly sourceWorkerName:
    string | null;
  readonly targetWorkerName:
    string | null;
  readonly jobsToMove: number;
  readonly sourceUtilization: number;
  readonly targetUtilization: number;
  readonly reason: string;
}

export interface DynamicRebalancingPlan {
  readonly queueName: string;
  readonly actions:
    readonly RebalancingAction[];
  readonly overloadedWorkers:
    readonly string[];
  readonly underloadedWorkers:
    readonly string[];
  readonly totalJobsToMove: number;
  readonly balanced: boolean;
  readonly generatedAt: Date;
}

export interface DynamicRebalancingMetrics {
  readonly totalPlans: number;
  readonly balancedPlans: number;
  readonly rebalancingPlans: number;
  readonly totalActions: number;
  readonly totalJobsPlannedForMovement: number;
  readonly collectedAt: Date;
}

const DEFAULT_POLICY:
  DynamicRebalancingPolicy = {
    overloadThreshold: 0.8,
    underloadThreshold: 0.4,
    minimumHealthScore: 0.5,
    maximumMovesPerCycle: 100,
    preserveMinimumJobs: 0,
  };

@Injectable()
export class DynamicRebalancingService {
  private totalPlans = 0;

  private balancedPlans = 0;

  private rebalancingPlans = 0;

  private totalActions = 0;

  private totalJobsPlannedForMovement = 0;

  plan(
    request:
      DynamicRebalancingRequest,
  ): DynamicRebalancingPlan {
    const queueName =
      this.requireText(
        request.queueName,
        'queueName',
      );

    const policy =
      this.normalizePolicy(
        request.policy,
      );

    const generatedAt =
      new Date(
        request.now ??
        new Date(),
      );

    const workers =
      request.workers
        .filter(
          (worker) =>
            worker.queueName ===
            queueName,
        )
        .map(
          (worker) =>
            this.normalizeWorker(
              worker,
            ),
        );

    const overloaded =
      workers
        .filter(
          (worker) =>
            !worker.draining &&
            worker.utilization >
              policy.overloadThreshold,
        )
        .sort(
          (left, right) => {
            if (
              left.utilization !==
              right.utilization
            ) {
              return (
                right.utilization -
                left.utilization
              );
            }

            return left.workerName
              .localeCompare(
                right.workerName,
              );
          },
        );

    const underloaded =
      workers
        .filter(
          (worker) =>
            !worker.draining &&
            worker.healthScore >=
              policy.minimumHealthScore &&
            worker.utilization <
              policy.underloadThreshold &&
            worker.availableSlots > 0,
        )
        .sort(
          (left, right) => {
            if (
              left.utilization !==
              right.utilization
            ) {
              return (
                left.utilization -
                right.utilization
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
        );

    const remainingTargetSlots =
      new Map(
        underloaded.map(
          (worker) => [
            worker.workerName,
            worker.availableSlots,
          ],
        ),
      );

    const actions:
      RebalancingAction[] = [];

    let totalJobsToMove = 0;

    for (
      const source
      of overloaded
    ) {
      if (
        totalJobsToMove >=
        policy.maximumMovesPerCycle
      ) {
        break;
      }

      let movableJobs =
        Math.max(
          0,
          source.activeJobs -
          policy.preserveMinimumJobs,
        );

      for (
        const target
        of underloaded
      ) {
        if (
          movableJobs <= 0 ||
          totalJobsToMove >=
            policy.maximumMovesPerCycle
        ) {
          break;
        }

        if (
          source.workerName ===
          target.workerName
        ) {
          continue;
        }

        const targetSlots =
          remainingTargetSlots.get(
            target.workerName,
          ) ?? 0;

        if (targetSlots <= 0) {
          continue;
        }

        const remainingCycleCapacity =
          policy.maximumMovesPerCycle -
          totalJobsToMove;

        const sourceCurrentJobs =
          policy.preserveMinimumJobs +
          movableJobs;

        const targetAssignedJobs =
          target.availableSlots -
          targetSlots;

        const targetCurrentJobs =
          target.activeJobs +
          targetAssignedJobs;

        const utilizationDifferenceNumerator =
          (
            sourceCurrentJobs *
            target.concurrency
          ) -
          (
            targetCurrentJobs *
            source.concurrency
          );

        const maximumBalancingMove =
          Math.max(
            0,
            Math.floor(
              utilizationDifferenceNumerator /
              (
                source.concurrency +
                target.concurrency
              ),
            ),
          );

        const jobsToMove =
          Math.min(
            movableJobs,
            targetSlots,
            remainingCycleCapacity,
            maximumBalancingMove,
          );

        if (jobsToMove <= 0) {
          continue;
        }

        actions.push({
          type: 'move',
          queueName,
          sourceWorkerName:
            source.workerName,
          targetWorkerName:
            target.workerName,
          jobsToMove,
          sourceUtilization:
            source.utilization,
          targetUtilization:
            target.utilization,
          reason:
            `Move ${jobsToMove} job(s) from overloaded worker ${source.workerName} to underloaded worker ${target.workerName}.`,
        });

        movableJobs -=
          jobsToMove;

        totalJobsToMove +=
          jobsToMove;

        remainingTargetSlots.set(
          target.workerName,
          targetSlots -
          jobsToMove,
        );
      }
    }

    if (actions.length === 0) {
      actions.push({
        type: 'none',
        queueName,
        sourceWorkerName: null,
        targetWorkerName: null,
        jobsToMove: 0,
        sourceUtilization: 0,
        targetUtilization: 0,
        reason:
          'No safe rebalancing action is required.',
      });
    }

    const balanced =
      actions.every(
        (action) =>
          action.type === 'none',
      );

    this.totalPlans += 1;

    if (balanced) {
      this.balancedPlans += 1;
    } else {
      this.rebalancingPlans += 1;
    }

    this.totalActions +=
      actions.filter(
        (action) =>
          action.type === 'move',
      ).length;

    this.totalJobsPlannedForMovement +=
      totalJobsToMove;

    return {
      queueName,
      actions:
        actions.map(
          (action) => ({
            ...action,
          }),
        ),
      overloadedWorkers:
        overloaded.map(
          (worker) =>
            worker.workerName,
        ),
      underloadedWorkers:
        underloaded.map(
          (worker) =>
            worker.workerName,
        ),
      totalJobsToMove,
      balanced,
      generatedAt,
    };
  }

  getMetrics(
    collectedAt =
      new Date(),
  ): DynamicRebalancingMetrics {
    return {
      totalPlans:
        this.totalPlans,
      balancedPlans:
        this.balancedPlans,
      rebalancingPlans:
        this.rebalancingPlans,
      totalActions:
        this.totalActions,
      totalJobsPlannedForMovement:
        this.totalJobsPlannedForMovement,
      collectedAt:
        new Date(
          collectedAt,
        ),
    };
  }

  reset(): void {
    this.totalPlans = 0;
    this.balancedPlans = 0;
    this.rebalancingPlans = 0;
    this.totalActions = 0;
    this.totalJobsPlannedForMovement = 0;
  }

  private normalizeWorker(
    worker:
      RebalancingWorkerSnapshot,
  ): RebalancingWorkerSnapshot & {
    readonly availableSlots: number;
    readonly utilization: number;
  } {
    const workerName =
      this.requireText(
        worker.workerName,
        'workerName',
      );

    const queueName =
      this.requireText(
        worker.queueName,
        'queueName',
      );

    const concurrency =
      this.requirePositiveInteger(
        worker.concurrency,
        'concurrency',
      );

    const activeJobs =
      this.requireNonNegativeInteger(
        worker.activeJobs,
        'activeJobs',
      );

    this.assertProbability(
      worker.healthScore,
      'healthScore',
    );

    const availableSlots =
      Math.max(
        0,
        concurrency -
        activeJobs,
      );

    const utilization =
      this.round(
        Math.min(
          1,
          activeJobs /
          concurrency,
        ),
      );

    return {
      workerName,
      queueName,
      concurrency,
      activeJobs,
      healthScore:
        worker.healthScore,
      draining:
        Boolean(
          worker.draining,
        ),
      availableSlots,
      utilization,
    };
  }

  private normalizePolicy(
    input:
      Partial<DynamicRebalancingPolicy> |
      undefined,
  ): DynamicRebalancingPolicy {
    const policy = {
      ...DEFAULT_POLICY,
      ...input,
    };

    this.assertProbability(
      policy.overloadThreshold,
      'overloadThreshold',
    );

    this.assertProbability(
      policy.underloadThreshold,
      'underloadThreshold',
    );

    this.assertProbability(
      policy.minimumHealthScore,
      'minimumHealthScore',
    );

    if (
      policy.underloadThreshold >=
      policy.overloadThreshold
    ) {
      throw new Error(
        'underloadThreshold must be lower than overloadThreshold.',
      );
    }

    this.requirePositiveInteger(
      policy.maximumMovesPerCycle,
      'maximumMovesPerCycle',
    );

    this.requireNonNegativeInteger(
      policy.preserveMinimumJobs,
      'preserveMinimumJobs',
    );

    return policy;
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

  private requirePositiveInteger(
    value: number,
    fieldName: string,
  ): number {
    if (
      !Number.isInteger(value) ||
      value <= 0
    ) {
      throw new Error(
        `${fieldName} must be a positive integer.`,
      );
    }

    return value;
  }

  private requireNonNegativeInteger(
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

  private round(
    value: number,
  ): number {
    return Math.round(
      value * 1000,
    ) / 1000;
  }
}