import { Injectable } from '@nestjs/common';

export interface WorkflowCheckpointPersistenceRecord {
  id: string;
  executionId: string;
  sequence: number;
  state: Record<string, unknown>;
  completedStepIds: string[];
  activeStepIds: string[];
  checksum: string;
  createdAt: Date;
}

export interface CreateWorkflowCheckpointPersistenceRecord {
  id: string;
  executionId: string;
  sequence: number;
  state?: Record<string, unknown>;
  completedStepIds?: string[];
  activeStepIds?: string[];
  checksum: string;
  createdAt?: Date;
}

@Injectable()
export class WorkflowCheckpointEntity {
  create(
    input: CreateWorkflowCheckpointPersistenceRecord,
  ): WorkflowCheckpointPersistenceRecord {
    return this.rehydrate({
      id: input.id,
      executionId: input.executionId,
      sequence: input.sequence,
      state: input.state ?? {},
      completedStepIds: input.completedStepIds ?? [],
      activeStepIds: input.activeStepIds ?? [],
      checksum: input.checksum,
      createdAt: input.createdAt ?? new Date(),
    });
  }

  rehydrate(
    record: WorkflowCheckpointPersistenceRecord,
  ): WorkflowCheckpointPersistenceRecord {
    this.validate(record);

    return {
      id: record.id.trim(),
      executionId: record.executionId.trim(),
      sequence: record.sequence,
      state: structuredClone(record.state),
      completedStepIds: [...record.completedStepIds],
      activeStepIds: [...record.activeStepIds],
      checksum: record.checksum.trim(),
      createdAt: new Date(record.createdAt),
    };
  }

  private validate(record: WorkflowCheckpointPersistenceRecord): void {
    if (!record.id?.trim()) {
      throw new Error('Workflow checkpoint id is required.');
    }

    if (!record.executionId?.trim()) {
      throw new Error('Workflow checkpoint executionId is required.');
    }

    if (!Number.isSafeInteger(record.sequence) || record.sequence < 1) {
      throw new Error('Workflow checkpoint sequence must be a positive integer.');
    }

    if (!record.checksum?.trim()) {
      throw new Error('Workflow checkpoint checksum is required.');
    }

    this.assertUnique(record.completedStepIds, 'completedStepIds');
    this.assertUnique(record.activeStepIds, 'activeStepIds');

    const overlap = record.activeStepIds.find((stepId) =>
      record.completedStepIds.includes(stepId),
    );

    if (overlap) {
      throw new Error(
        'A workflow step cannot be both active and completed in a checkpoint.',
      );
    }
  }

  private assertUnique(values: string[], fieldName: string): void {
    if (new Set(values).size !== values.length) {
      throw new Error(`${fieldName} must not contain duplicates.`);
    }
  }
}
