import { Injectable } from '@nestjs/common';

export type WorkflowRecoveryStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'abandoned';

export interface WorkflowRecoveryPersistenceRecord {
  id: string;
  executionId: string;
  checkpointId: string | null;
  status: WorkflowRecoveryStatus;
  attempt: number;
  reason: string;
  restoredStepIds: string[];
  errorMessage: string | null;
  requestedAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
}

export interface CreateWorkflowRecoveryPersistenceRecord {
  id: string;
  executionId: string;
  checkpointId?: string | null;
  status?: WorkflowRecoveryStatus;
  attempt?: number;
  reason: string;
  restoredStepIds?: string[];
  errorMessage?: string | null;
  requestedAt?: Date;
  startedAt?: Date | null;
  completedAt?: Date | null;
}

const TERMINAL_RECOVERY_STATUSES = new Set<WorkflowRecoveryStatus>([
  'completed',
  'failed',
  'abandoned',
]);

@Injectable()
export class WorkflowRecoveryEntity {
  create(
    input: CreateWorkflowRecoveryPersistenceRecord,
  ): WorkflowRecoveryPersistenceRecord {
    return this.rehydrate({
      id: input.id,
      executionId: input.executionId,
      checkpointId: input.checkpointId ?? null,
      status: input.status ?? 'pending',
      attempt: input.attempt ?? 1,
      reason: input.reason,
      restoredStepIds: input.restoredStepIds ?? [],
      errorMessage: input.errorMessage ?? null,
      requestedAt: input.requestedAt ?? new Date(),
      startedAt: input.startedAt ?? null,
      completedAt: input.completedAt ?? null,
    });
  }

  rehydrate(
    record: WorkflowRecoveryPersistenceRecord,
  ): WorkflowRecoveryPersistenceRecord {
    this.validate(record);

    return {
      id: record.id.trim(),
      executionId: record.executionId.trim(),
      checkpointId:
        record.checkpointId === null ? null : record.checkpointId.trim(),
      status: record.status,
      attempt: record.attempt,
      reason: record.reason.trim(),
      restoredStepIds: [...record.restoredStepIds],
      errorMessage: record.errorMessage,
      requestedAt: new Date(record.requestedAt),
      startedAt: this.cloneDate(record.startedAt),
      completedAt: this.cloneDate(record.completedAt),
    };
  }

  private validate(record: WorkflowRecoveryPersistenceRecord): void {
    if (!record.id?.trim()) {
      throw new Error('Workflow recovery id is required.');
    }

    if (!record.executionId?.trim()) {
      throw new Error('Workflow recovery executionId is required.');
    }

    if (!record.reason?.trim()) {
      throw new Error('Workflow recovery reason is required.');
    }

    if (!Number.isSafeInteger(record.attempt) || record.attempt < 1) {
      throw new Error('Workflow recovery attempt must be a positive integer.');
    }

    if (new Set(record.restoredStepIds).size !== record.restoredStepIds.length) {
      throw new Error('restoredStepIds must not contain duplicates.');
    }

    if (record.status === 'running' && record.startedAt === null) {
      throw new Error('startedAt is required for running workflow recovery.');
    }

    if (
      TERMINAL_RECOVERY_STATUSES.has(record.status) &&
      record.completedAt === null
    ) {
      throw new Error('completedAt is required for terminal workflow recovery.');
    }

    if (record.status === 'failed' && !record.errorMessage?.trim()) {
      throw new Error('errorMessage is required for failed workflow recovery.');
    }
  }

  private cloneDate(value: Date | null): Date | null {
    return value === null ? null : new Date(value);
  }
}
