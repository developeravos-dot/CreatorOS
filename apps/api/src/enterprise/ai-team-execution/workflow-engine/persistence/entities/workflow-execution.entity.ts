import { Injectable } from '@nestjs/common';

export type PersistedWorkflowExecutionStatus =
  | 'pending'
  | 'running'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface WorkflowExecutionPersistenceRecord {
  id: string;
  workflowId: string;
  status: PersistedWorkflowExecutionStatus;
  maxParallelSteps: number;
  activeStepIds: string[];
  context: Record<string, unknown>;
  metadata: Record<string, unknown>;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  startedAt: Date | null;
  pausedAt: Date | null;
  completedAt: Date | null;
  failureReason: string | null;
}

export interface CreateWorkflowExecutionPersistenceRecord {
  id: string;
  workflowId: string;
  status?: PersistedWorkflowExecutionStatus;
  maxParallelSteps?: number;
  activeStepIds?: string[];
  context?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  version?: number;
  createdAt?: Date;
  updatedAt?: Date;
  startedAt?: Date | null;
  pausedAt?: Date | null;
  completedAt?: Date | null;
  failureReason?: string | null;
}

const TERMINAL_STATUSES = new Set<PersistedWorkflowExecutionStatus>([
  'completed',
  'failed',
  'cancelled',
]);

@Injectable()
export class WorkflowExecutionEntity {
  create(
    input: CreateWorkflowExecutionPersistenceRecord,
  ): WorkflowExecutionPersistenceRecord {
    const now = new Date();

    return this.rehydrate({
      id: input.id,
      workflowId: input.workflowId,
      status: input.status ?? 'pending',
      maxParallelSteps: input.maxParallelSteps ?? 1,
      activeStepIds: input.activeStepIds ?? [],
      context: input.context ?? {},
      metadata: input.metadata ?? {},
      version: input.version ?? 1,
      createdAt: input.createdAt ?? now,
      updatedAt: input.updatedAt ?? now,
      startedAt: input.startedAt ?? null,
      pausedAt: input.pausedAt ?? null,
      completedAt: input.completedAt ?? null,
      failureReason: input.failureReason ?? null,
    });
  }

  rehydrate(
    record: WorkflowExecutionPersistenceRecord,
  ): WorkflowExecutionPersistenceRecord {
    this.validate(record);

    return {
      id: record.id.trim(),
      workflowId: record.workflowId.trim(),
      status: record.status,
      maxParallelSteps: record.maxParallelSteps,
      activeStepIds: [...record.activeStepIds],
      context: this.cloneObject(record.context),
      metadata: this.cloneObject(record.metadata),
      version: record.version,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      startedAt: this.cloneDate(record.startedAt),
      pausedAt: this.cloneDate(record.pausedAt),
      completedAt: this.cloneDate(record.completedAt),
      failureReason: record.failureReason,
    };
  }

  nextVersion(
    record: WorkflowExecutionPersistenceRecord,
    changes: Partial<Omit<
      WorkflowExecutionPersistenceRecord,
      'id' | 'workflowId' | 'createdAt' | 'version'
    >>,
    updatedAt = new Date(),
  ): WorkflowExecutionPersistenceRecord {
    return this.rehydrate({
      ...record,
      ...changes,
      id: record.id,
      workflowId: record.workflowId,
      createdAt: record.createdAt,
      updatedAt,
      version: record.version + 1,
    });
  }

  private validate(
    record: WorkflowExecutionPersistenceRecord,
  ): void {
    if (!record.id?.trim()) {
      throw new Error('Workflow execution id is required.');
    }

    if (!record.workflowId?.trim()) {
      throw new Error('Workflow id is required.');
    }

    if (
      !Number.isSafeInteger(record.maxParallelSteps) ||
      record.maxParallelSteps < 1
    ) {
      throw new Error(
        'maxParallelSteps must be a positive integer.',
      );
    }

    if (
      !Number.isSafeInteger(record.version) ||
      record.version < 1
    ) {
      throw new Error('version must be a positive integer.');
    }

    if (
      new Set(record.activeStepIds).size !==
      record.activeStepIds.length
    ) {
      throw new Error('activeStepIds must not contain duplicates.');
    }

    if (record.updatedAt.getTime() < record.createdAt.getTime()) {
      throw new Error('updatedAt cannot be earlier than createdAt.');
    }

    if (
      TERMINAL_STATUSES.has(record.status) &&
      record.completedAt === null
    ) {
      throw new Error(
        'completedAt is required for terminal execution statuses.',
      );
    }

    if (
      record.status === 'failed' &&
      !record.failureReason?.trim()
    ) {
      throw new Error(
        'failureReason is required for failed executions.',
      );
    }
  }

  private cloneDate(value: Date | null): Date | null {
    return value === null ? null : new Date(value);
  }

  private cloneObject(
    value: Record<string, unknown>,
  ): Record<string, unknown> {
    return structuredClone(value);
  }
}
