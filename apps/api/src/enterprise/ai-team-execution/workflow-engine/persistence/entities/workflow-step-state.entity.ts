import { Injectable } from '@nestjs/common';

export type PersistedWorkflowStepStatus =
  | 'pending'
  | 'ready'
  | 'running'
  | 'completed'
  | 'failed'
  | 'skipped'
  | 'cancelled';

export interface WorkflowStepStatePersistenceRecord {
  id: string;
  executionId: string;
  stepId: string;
  status: PersistedWorkflowStepStatus;
  attempt: number;
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
  errorMessage: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

export interface CreateWorkflowStepStatePersistenceRecord {
  id: string;
  executionId: string;
  stepId: string;
  status?: PersistedWorkflowStepStatus;
  attempt?: number;
  input?: Record<string, unknown>;
  output?: Record<string, unknown> | null;
  errorMessage?: string | null;
  startedAt?: Date | null;
  completedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  version?: number;
}

const TERMINAL_STEP_STATUSES = new Set<PersistedWorkflowStepStatus>([
  'completed',
  'failed',
  'skipped',
  'cancelled',
]);

@Injectable()
export class WorkflowStepStateEntity {
  create(
    input: CreateWorkflowStepStatePersistenceRecord,
  ): WorkflowStepStatePersistenceRecord {
    const now = new Date();

    return this.rehydrate({
      id: input.id,
      executionId: input.executionId,
      stepId: input.stepId,
      status: input.status ?? 'pending',
      attempt: input.attempt ?? 0,
      input: input.input ?? {},
      output: input.output ?? null,
      errorMessage: input.errorMessage ?? null,
      startedAt: input.startedAt ?? null,
      completedAt: input.completedAt ?? null,
      createdAt: input.createdAt ?? now,
      updatedAt: input.updatedAt ?? now,
      version: input.version ?? 1,
    });
  }

  rehydrate(
    record: WorkflowStepStatePersistenceRecord,
  ): WorkflowStepStatePersistenceRecord {
    this.validate(record);

    return {
      id: record.id.trim(),
      executionId: record.executionId.trim(),
      stepId: record.stepId.trim(),
      status: record.status,
      attempt: record.attempt,
      input: structuredClone(record.input),
      output: record.output === null ? null : structuredClone(record.output),
      errorMessage: record.errorMessage,
      startedAt: this.cloneDate(record.startedAt),
      completedAt: this.cloneDate(record.completedAt),
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      version: record.version,
    };
  }

  private validate(record: WorkflowStepStatePersistenceRecord): void {
    if (!record.id?.trim()) {
      throw new Error('Workflow step state id is required.');
    }

    if (!record.executionId?.trim()) {
      throw new Error('Workflow step state executionId is required.');
    }

    if (!record.stepId?.trim()) {
      throw new Error('Workflow step state stepId is required.');
    }

    if (!Number.isSafeInteger(record.attempt) || record.attempt < 0) {
      throw new Error('Workflow step attempt must be a non-negative integer.');
    }

    if (!Number.isSafeInteger(record.version) || record.version < 1) {
      throw new Error('Workflow step state version must be a positive integer.');
    }

    if (record.updatedAt.getTime() < record.createdAt.getTime()) {
      throw new Error('Workflow step state updatedAt cannot precede createdAt.');
    }

    if (record.status === 'running' && record.startedAt === null) {
      throw new Error('startedAt is required for running workflow steps.');
    }

    if (
      TERMINAL_STEP_STATUSES.has(record.status) &&
      record.completedAt === null
    ) {
      throw new Error('completedAt is required for terminal workflow steps.');
    }

    if (record.status === 'failed' && !record.errorMessage?.trim()) {
      throw new Error('errorMessage is required for failed workflow steps.');
    }
  }

  private cloneDate(value: Date | null): Date | null {
    return value === null ? null : new Date(value);
  }
}
