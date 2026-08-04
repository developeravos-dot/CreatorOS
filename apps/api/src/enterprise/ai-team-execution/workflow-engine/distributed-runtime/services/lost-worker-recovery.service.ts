import { Injectable } from '@nestjs/common';

import type {
  DistributedExecutionRecord,
} from '../models';
import {
  ExecutionRuntimeCoordinatorService,
} from './execution-runtime-coordinator.service';

export interface LostWorkerRecoveryResult {
  readonly workerId: string;
  readonly recoveredExecutions:
    readonly DistributedExecutionRecord[];
  readonly recoveredAt: Date;
}

@Injectable()
export class LostWorkerRecoveryService {
  constructor(
    private readonly coordinator:
      ExecutionRuntimeCoordinatorService =
        new ExecutionRuntimeCoordinatorService(),
  ) {}

  recover(
    workerId: string,
    now = new Date(),
  ): LostWorkerRecoveryResult {
    const normalized = workerId.trim();

    if (!normalized) {
      throw new Error('workerId is required.');
    }

    const recovered =
      this.coordinator.recoverLostWorker(
        normalized,
        now,
      );

    return {
      workerId: normalized,
      recoveredExecutions: recovered,
      recoveredAt: new Date(now),
    };
  }
}
