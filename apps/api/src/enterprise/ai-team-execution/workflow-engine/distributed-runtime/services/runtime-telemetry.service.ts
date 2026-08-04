import { Injectable } from '@nestjs/common';

import type {
  DistributedExecutionRecord,
  DistributedWorkerRuntimeRecord,
} from '../models';
import type {
  ExecutionRuntimeEvent,
} from './execution-event-bus.service';

export interface RuntimeTelemetrySnapshot {
  readonly totalExecutions: number;
  readonly runningExecutions: number;
  readonly succeededExecutions: number;
  readonly failedExecutions: number;
  readonly retryingExecutions: number;
  readonly reassignedExecutions: number;
  readonly totalWorkers: number;
  readonly activeWorkers: number;
  readonly offlineWorkers: number;
  readonly activeLeases: number;
  readonly totalEvents: number;
  readonly averageExecutionLatencyMs: number;
  readonly warnings: readonly string[];
  readonly collectedAt: Date;
}

@Injectable()
export class RuntimeTelemetryService {
  snapshot(input: {
    readonly executions:
      readonly DistributedExecutionRecord[];
    readonly workers:
      readonly DistributedWorkerRuntimeRecord[];
    readonly events:
      readonly ExecutionRuntimeEvent[];
    readonly activeLeases: number;
    readonly now?: Date;
  }): RuntimeTelemetrySnapshot {
    const completedWithLatency =
      input.executions.filter(
        (execution) =>
          execution.startedAt !== null &&
          execution.completedAt !== null,
      );

    const totalLatency =
      completedWithLatency.reduce(
        (sum, execution) =>
          sum +
          (
            execution.completedAt!.getTime() -
            execution.startedAt!.getTime()
          ),
        0,
      );

    const offlineWorkers =
      input.workers.filter(
        (worker) => worker.state === 'offline',
      ).length;

    const failedExecutions =
      input.executions.filter(
        (execution) =>
          execution.state === 'failed',
      ).length;

    const warnings: string[] = [];

    if (offlineWorkers > 0) {
      warnings.push(
        `${offlineWorkers} runtime worker(s) are offline.`,
      );
    }

    if (failedExecutions > 0) {
      warnings.push(
        `${failedExecutions} distributed execution(s) failed.`,
      );
    }

    return {
      totalExecutions:
        input.executions.length,
      runningExecutions:
        input.executions.filter(
          (execution) =>
            execution.state === 'running',
        ).length,
      succeededExecutions:
        input.executions.filter(
          (execution) =>
            execution.state === 'succeeded',
        ).length,
      failedExecutions,
      retryingExecutions:
        input.executions.filter(
          (execution) =>
            execution.state === 'retrying',
        ).length,
      reassignedExecutions:
        input.executions.filter(
          (execution) =>
            execution.state === 'reassigned',
        ).length,
      totalWorkers:
        input.workers.length,
      activeWorkers:
        input.workers.filter(
          (worker) =>
            worker.state === 'active',
        ).length,
      offlineWorkers,
      activeLeases: input.activeLeases,
      totalEvents: input.events.length,
      averageExecutionLatencyMs:
        completedWithLatency.length === 0
          ? 0
          : Math.round(
              totalLatency /
              completedWithLatency.length,
            ),
      warnings,
      collectedAt: new Date(
        input.now ?? new Date(),
      ),
    };
  }
}
