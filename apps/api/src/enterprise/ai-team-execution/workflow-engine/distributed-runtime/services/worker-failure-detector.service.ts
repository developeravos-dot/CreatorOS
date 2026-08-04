import { Injectable } from '@nestjs/common';

import type {
  DistributedWorkerRuntimeRecord,
} from '../models';
import {
  DistributedWorkerRuntimeService,
} from './distributed-worker-runtime.service';

export interface WorkerFailureDetectionResult {
  readonly offlineWorkers:
    readonly DistributedWorkerRuntimeRecord[];
  readonly detectedAt: Date;
}

@Injectable()
export class WorkerFailureDetectorService {
  constructor(
    private readonly workers:
      DistributedWorkerRuntimeService =
        new DistributedWorkerRuntimeService(),
  ) {}

  detect(
    heartbeatTimeoutMs: number,
    now = new Date(),
  ): WorkerFailureDetectionResult {
    this.positive(
      heartbeatTimeoutMs,
      'heartbeatTimeoutMs',
    );

    const cutoff =
      now.getTime() - heartbeatTimeoutMs;

    const offlineWorkers =
      this.workers.list().filter(
        (worker) =>
          worker.state !== 'offline' &&
          worker.lastHeartbeatAt.getTime() <= cutoff,
      );

    for (const worker of offlineWorkers) {
      this.workers.setState(
        worker.workerId,
        'offline',
      );
    }

    return {
      offlineWorkers:
        offlineWorkers.map((worker) => ({
          ...worker,
          state: 'offline',
          capabilities: [...worker.capabilities],
          activeExecutionIds: [
            ...worker.activeExecutionIds,
          ],
          registeredAt: new Date(
            worker.registeredAt,
          ),
          lastHeartbeatAt: new Date(
            worker.lastHeartbeatAt,
          ),
        })),
      detectedAt: new Date(now),
    };
  }

  private positive(
    value: number,
    field: string,
  ): void {
    if (!Number.isInteger(value) || value < 1) {
      throw new Error(
        `${field} must be a positive integer.`,
      );
    }
  }
}
