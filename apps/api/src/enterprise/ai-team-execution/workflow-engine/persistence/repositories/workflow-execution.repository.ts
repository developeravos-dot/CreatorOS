import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import { PrismaService } from '../../../../../modules/persistence';
import {
  PersistedWorkflowExecutionStatus,
  WorkflowExecutionEntity,
  WorkflowExecutionPersistenceRecord,
} from '../entities';

@Injectable()
export class WorkflowExecutionRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly entity: WorkflowExecutionEntity,
  ) {}

  async save(
    record: WorkflowExecutionPersistenceRecord,
    expectedVersion?: number,
  ): Promise<WorkflowExecutionPersistenceRecord> {
    const normalized = this.entity.rehydrate(record);
    const data = this.toCreateInput(normalized);

    if (expectedVersion === undefined) {
      const existing =
        await this.prisma.workflowExecutionPersistence.findUnique({
          where: { id: normalized.id },
          select: { version: true },
        });

      if (existing && normalized.version <= existing.version) {
        throw new Error(
          `Workflow execution version must advance for ${normalized.id}.`,
        );
      }

      const persisted =
        await this.prisma.workflowExecutionPersistence.upsert({
          where: { id: normalized.id },
          create: data,
          update: this.toUpdateInput(normalized),
        });

      return this.fromPrisma(persisted);
    }

    const updated =
      await this.prisma.workflowExecutionPersistence.updateMany({
        where: {
          id: normalized.id,
          version: expectedVersion,
        },
        data: this.toUpdateInput(normalized),
      });

    if (updated.count !== 1) {
      throw new Error(
        `Workflow execution optimistic-lock conflict for ${normalized.id}.`,
      );
    }

    const persisted =
      await this.prisma.workflowExecutionPersistence.findUniqueOrThrow({
        where: { id: normalized.id },
      });

    return this.fromPrisma(persisted);
  }

  async findById(
    id: string,
  ): Promise<WorkflowExecutionPersistenceRecord | null> {
    const record =
      await this.prisma.workflowExecutionPersistence.findUnique({
        where: { id: id.trim() },
      });

    return record ? this.fromPrisma(record) : null;
  }

  async listByStatus(
    status: PersistedWorkflowExecutionStatus,
  ): Promise<WorkflowExecutionPersistenceRecord[]> {
    const records =
      await this.prisma.workflowExecutionPersistence.findMany({
        where: { status },
        orderBy: { createdAt: 'asc' },
      });

    return records.map((record) => this.fromPrisma(record));
  }

  async listRecoverable(): Promise<WorkflowExecutionPersistenceRecord[]> {
    const records =
      await this.prisma.workflowExecutionPersistence.findMany({
        where: {
          status: { in: ['pending', 'running', 'paused'] },
        },
        orderBy: { updatedAt: 'asc' },
      });

    return records.map((record) => this.fromPrisma(record));
  }

  async delete(id: string): Promise<boolean> {
    const result =
      await this.prisma.workflowExecutionPersistence.deleteMany({
        where: { id: id.trim() },
      });

    return result.count === 1;
  }

  private toCreateInput(
    record: WorkflowExecutionPersistenceRecord,
  ): Prisma.WorkflowExecutionPersistenceCreateInput {
    return {
      id: record.id,
      workflowId: record.workflowId,
      status: record.status,
      maxParallelSteps: record.maxParallelSteps,
      activeStepIds: record.activeStepIds,
      context: record.context as Prisma.InputJsonValue,
      metadata: record.metadata as Prisma.InputJsonValue,
      version: record.version,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      startedAt: record.startedAt,
      pausedAt: record.pausedAt,
      completedAt: record.completedAt,
      failureReason: record.failureReason,
    };
  }

  private toUpdateInput(
    record: WorkflowExecutionPersistenceRecord,
  ): Prisma.WorkflowExecutionPersistenceUpdateInput {
    return {
      workflowId: record.workflowId,
      status: record.status,
      maxParallelSteps: record.maxParallelSteps,
      activeStepIds: record.activeStepIds,
      context: record.context as Prisma.InputJsonValue,
      metadata: record.metadata as Prisma.InputJsonValue,
      version: record.version,
      updatedAt: record.updatedAt,
      startedAt: record.startedAt,
      pausedAt: record.pausedAt,
      completedAt: record.completedAt,
      failureReason: record.failureReason,
    };
  }

  private fromPrisma(record: {
    id: string;
    workflowId: string;
    status: string;
    maxParallelSteps: number;
    activeStepIds: string[];
    context: Prisma.JsonValue;
    metadata: Prisma.JsonValue;
    version: number;
    createdAt: Date;
    updatedAt: Date;
    startedAt: Date | null;
    pausedAt: Date | null;
    completedAt: Date | null;
    failureReason: string | null;
  }): WorkflowExecutionPersistenceRecord {
    return this.entity.rehydrate({
      ...record,
      status: record.status as PersistedWorkflowExecutionStatus,
      context: record.context as Record<string, unknown>,
      metadata: record.metadata as Record<string, unknown>,
    });
  }
}