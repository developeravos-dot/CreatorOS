import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import { PrismaService } from '../../../../../modules/persistence';
import {
  WorkflowCheckpointEntity,
  WorkflowCheckpointPersistenceRecord,
} from '../entities';

@Injectable()
export class WorkflowCheckpointRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly entity: WorkflowCheckpointEntity,
  ) {}

  async save(record: WorkflowCheckpointPersistenceRecord): Promise<WorkflowCheckpointPersistenceRecord> {
    const value = this.entity.rehydrate(record);
    const persisted = await this.prisma.workflowCheckpointPersistence.upsert({
      where: { id: value.id },
      create: {
        id: value.id,
        sequence: value.sequence,
        state: value.state as Prisma.InputJsonValue,
        completedStepIds: value.completedStepIds,
        activeStepIds: value.activeStepIds,
        checksum: value.checksum,
        createdAt: value.createdAt,
        execution: { connect: { id: value.executionId } },
      },
      update: {
        sequence: value.sequence,
        state: value.state as Prisma.InputJsonValue,
        completedStepIds: value.completedStepIds,
        activeStepIds: value.activeStepIds,
        checksum: value.checksum,
      },
    });
    return this.fromPrisma(persisted);
  }

  async findById(id: string): Promise<WorkflowCheckpointPersistenceRecord | null> {
    const record = await this.prisma.workflowCheckpointPersistence.findUnique({ where: { id: id.trim() } });
    return record ? this.fromPrisma(record) : null;
  }

  async findLatestByExecutionId(executionId: string): Promise<WorkflowCheckpointPersistenceRecord | null> {
    const record = await this.prisma.workflowCheckpointPersistence.findFirst({
      where: { executionId: executionId.trim() },
      orderBy: { sequence: 'desc' },
    });
    return record ? this.fromPrisma(record) : null;
  }

  async listByExecutionId(executionId: string): Promise<WorkflowCheckpointPersistenceRecord[]> {
    const records = await this.prisma.workflowCheckpointPersistence.findMany({
      where: { executionId: executionId.trim() },
      orderBy: { sequence: 'asc' },
    });
    return records.map((record) => this.fromPrisma(record));
  }

  async deleteByExecutionId(executionId: string): Promise<number> {
    const result = await this.prisma.workflowCheckpointPersistence.deleteMany({
      where: { executionId: executionId.trim() },
    });
    return result.count;
  }

  private fromPrisma(record: {
    id: string; executionId: string; sequence: number; state: Prisma.JsonValue;
    completedStepIds: string[]; activeStepIds: string[]; checksum: string; createdAt: Date;
  }): WorkflowCheckpointPersistenceRecord {
    return this.entity.rehydrate({
      ...record,
      state: record.state as Record<string, unknown>,
    });
  }
}