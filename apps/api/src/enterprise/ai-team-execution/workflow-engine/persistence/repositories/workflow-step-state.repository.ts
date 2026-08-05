import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import { PrismaService } from '../../../../../modules/persistence';
import {
  PersistedWorkflowStepStatus,
  WorkflowStepStateEntity,
  WorkflowStepStatePersistenceRecord,
} from '../entities';

@Injectable()
export class WorkflowStepStateRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly entity: WorkflowStepStateEntity,
  ) {}

  async save(record: WorkflowStepStatePersistenceRecord, expectedVersion?: number): Promise<WorkflowStepStatePersistenceRecord> {
    const value = this.entity.rehydrate(record);

    if (expectedVersion !== undefined) {
      const result = await this.prisma.workflowStepStatePersistence.updateMany({
        where: { id: value.id, version: expectedVersion },
        data: this.toUpdate(value),
      });
      if (result.count !== 1) {
        throw new Error(`Workflow step state optimistic-lock conflict for ${value.id}.`);
      }
      const persisted = await this.prisma.workflowStepStatePersistence.findUniqueOrThrow({ where: { id: value.id } });
      return this.fromPrisma(persisted);
    }

    const persisted = await this.prisma.workflowStepStatePersistence.upsert({
      where: { id: value.id },
      create: {
        id: value.id,
        stepId: value.stepId,
        status: value.status,
        attempt: value.attempt,
        input: value.input as Prisma.InputJsonValue,
        output: value.output === null ? Prisma.JsonNull : value.output as Prisma.InputJsonValue,
        errorMessage: value.errorMessage,
        startedAt: value.startedAt,
        completedAt: value.completedAt,
        createdAt: value.createdAt,
        updatedAt: value.updatedAt,
        version: value.version,
        execution: { connect: { id: value.executionId } },
      },
      update: this.toUpdate(value),
    });
    return this.fromPrisma(persisted);
  }

  async findById(id: string): Promise<WorkflowStepStatePersistenceRecord | null> {
    const record = await this.prisma.workflowStepStatePersistence.findUnique({ where: { id: id.trim() } });
    return record ? this.fromPrisma(record) : null;
  }

  async findByExecutionAndStep(executionId: string, stepId: string): Promise<WorkflowStepStatePersistenceRecord | null> {
    const record = await this.prisma.workflowStepStatePersistence.findUnique({
      where: { executionId_stepId: { executionId: executionId.trim(), stepId: stepId.trim() } },
    });
    return record ? this.fromPrisma(record) : null;
  }

  async listByExecutionId(executionId: string): Promise<WorkflowStepStatePersistenceRecord[]> {
    const records = await this.prisma.workflowStepStatePersistence.findMany({
      where: { executionId: executionId.trim() },
      orderBy: { createdAt: 'asc' },
    });
    return records.map((record) => this.fromPrisma(record));
  }

  async listByExecutionAndStatus(executionId: string, status: PersistedWorkflowStepStatus): Promise<WorkflowStepStatePersistenceRecord[]> {
    const records = await this.prisma.workflowStepStatePersistence.findMany({
      where: { executionId: executionId.trim(), status },
      orderBy: { createdAt: 'asc' },
    });
    return records.map((record) => this.fromPrisma(record));
  }

  private toUpdate(value: WorkflowStepStatePersistenceRecord): Prisma.WorkflowStepStatePersistenceUpdateInput {
    return {
      status: value.status,
      attempt: value.attempt,
      input: value.input as Prisma.InputJsonValue,
      output: value.output === null ? Prisma.JsonNull : value.output as Prisma.InputJsonValue,
      errorMessage: value.errorMessage,
      startedAt: value.startedAt,
      completedAt: value.completedAt,
      updatedAt: value.updatedAt,
      version: value.version,
    };
  }

  private fromPrisma(record: {
    id: string; executionId: string; stepId: string; status: string; attempt: number;
    input: Prisma.JsonValue; output: Prisma.JsonValue; errorMessage: string | null;
    startedAt: Date | null; completedAt: Date | null; createdAt: Date; updatedAt: Date; version: number;
  }): WorkflowStepStatePersistenceRecord {
    return this.entity.rehydrate({
      ...record,
      status: record.status as PersistedWorkflowStepStatus,
      input: record.input as Record<string, unknown>,
      output: record.output === null ? null : record.output as Record<string, unknown>,
    });
  }
}