import { Injectable } from '@nestjs/common';

export interface WorkflowEventPersistenceRecord {
  id: string;
  executionId: string;
  sequence: number;
  type: string;
  payload: Record<string, unknown>;
  metadata: Record<string, unknown>;
  occurredAt: Date;
}

export interface CreateWorkflowEventPersistenceRecord {
  id: string;
  executionId: string;
  sequence: number;
  type: string;
  payload?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  occurredAt?: Date;
}

@Injectable()
export class WorkflowEventEntity {
  create(
    input: CreateWorkflowEventPersistenceRecord,
  ): WorkflowEventPersistenceRecord {
    return this.rehydrate({
      id: input.id,
      executionId: input.executionId,
      sequence: input.sequence,
      type: input.type,
      payload: input.payload ?? {},
      metadata: input.metadata ?? {},
      occurredAt: input.occurredAt ?? new Date(),
    });
  }

  rehydrate(
    record: WorkflowEventPersistenceRecord,
  ): WorkflowEventPersistenceRecord {
    this.validate(record);

    return {
      id: record.id.trim(),
      executionId: record.executionId.trim(),
      sequence: record.sequence,
      type: record.type.trim(),
      payload: structuredClone(record.payload),
      metadata: structuredClone(record.metadata),
      occurredAt: new Date(record.occurredAt),
    };
  }

  private validate(record: WorkflowEventPersistenceRecord): void {
    if (!record.id?.trim()) {
      throw new Error('Workflow event id is required.');
    }

    if (!record.executionId?.trim()) {
      throw new Error('Workflow event executionId is required.');
    }

    if (!Number.isSafeInteger(record.sequence) || record.sequence < 1) {
      throw new Error('Workflow event sequence must be a positive integer.');
    }

    if (!record.type?.trim()) {
      throw new Error('Workflow event type is required.');
    }
  }
}
