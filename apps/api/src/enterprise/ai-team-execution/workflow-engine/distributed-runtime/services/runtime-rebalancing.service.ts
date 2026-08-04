import { Injectable } from '@nestjs/common';

import type {
  DistributedWorkerRuntimeRecord,
} from '../models';
import {
  DistributedWorkerRuntimeService,
} from './distributed-worker-runtime.service';

export interface RuntimeRebalancingPolicy {
  readonly maximumMoves: number;
  readonly overloadRatio: number;
  readonly underloadRatio: number;
}

export interface RuntimeRebalancingMove {
  readonly executionId: string;
  readonly sourceWorkerId: string;
  readonly targetWorkerId: string;
}

export interface RuntimeRebalancingPlan {
  readonly moves: readonly RuntimeRebalancingMove[];
  readonly generatedAt: Date;
}

@Injectable()
export class RuntimeRebalancingService {
  constructor(
    private readonly workers:
      DistributedWorkerRuntimeService =
        new DistributedWorkerRuntimeService(),
  ) {}

  plan(
    policy: RuntimeRebalancingPolicy,
    now = new Date(),
  ): RuntimeRebalancingPlan {
    this.validatePolicy(policy);

    const workers = this.workers.list();

    const overloaded = workers
      .filter(
        (worker) =>
          this.load(worker) >= policy.overloadRatio &&
          worker.activeExecutionIds.length > 0,
      )
      .sort((left, right) =>
        this.load(right) - this.load(left),
      );

    const underloaded = workers
      .filter(
        (worker) =>
          worker.state === 'active' &&
          this.load(worker) <= policy.underloadRatio &&
          worker.activeExecutionIds.length <
            worker.maximumConcurrency,
      )
      .sort((left, right) => {
        const difference =
          this.load(left) - this.load(right);

        return difference !== 0
          ? difference
          : left.workerId.localeCompare(right.workerId);
      });

    const moves: RuntimeRebalancingMove[] = [];

    for (const source of overloaded) {
      for (const executionId of source.activeExecutionIds) {
        if (moves.length >= policy.maximumMoves) {
          break;
        }

        const target = underloaded.find(
          (candidate) =>
            candidate.workerId !== source.workerId &&
            candidate.activeExecutionIds.length +
              moves.filter(
                (move) =>
                  move.targetWorkerId ===
                  candidate.workerId,
              ).length <
              candidate.maximumConcurrency,
        );

        if (!target) {
          break;
        }

        moves.push({
          executionId,
          sourceWorkerId: source.workerId,
          targetWorkerId: target.workerId,
        });
      }

      if (moves.length >= policy.maximumMoves) {
        break;
      }
    }

    return {
      moves,
      generatedAt: new Date(now),
    };
  }

  private load(
    worker: DistributedWorkerRuntimeRecord,
  ): number {
    return (
      worker.activeExecutionIds.length /
      worker.maximumConcurrency
    );
  }

  private validatePolicy(
    policy: RuntimeRebalancingPolicy,
  ): void {
    if (
      !Number.isInteger(policy.maximumMoves) ||
      policy.maximumMoves < 1
    ) {
      throw new Error(
        'maximumMoves must be a positive integer.',
      );
    }

    for (const [
      field,
      value,
    ] of [
      ['overloadRatio', policy.overloadRatio],
      ['underloadRatio', policy.underloadRatio],
    ] as const) {
      if (
        !Number.isFinite(value) ||
        value < 0 ||
        value > 1
      ) {
        throw new Error(
          `${field} must be between 0 and 1.`,
        );
      }
    }

    if (
      policy.underloadRatio >=
      policy.overloadRatio
    ) {
      throw new Error(
        'underloadRatio must be less than overloadRatio.',
      );
    }
  }
}
