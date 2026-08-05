import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../modules/persistence';
import {
  WorkflowRecoveryEntity,
  WorkflowRecoveryPersistenceRecord,
  WorkflowRecoveryStatus,
} from '../entities';

@Injectable()
export class WorkflowRecoveryRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly entity: WorkflowRecoveryEntity,
  ) {}

  async save(record: WorkflowRecoveryPersistenceRecord): Promise<WorkflowRecoveryPersistenceRecord> {
    const value = this.entity.rehydrate(record);
    const persisted = await this.prisma.workflowRecoveryPersistence.upsert({
      where: { id: value.id },
      create: {
        id: value.id,
        status: value.status,
        attempt: value.attempt,
        reason: value.reason,
        restoredStepIds: value.restoredStepIds,
        errorMessage: value.errorMessage,
        requestedAt: value.requestedAt,
        startedAt: value.startedAt,
        completedAt: value.completedAt,
        execution: { connect: { id: value.executionId } },
        checkpoint: value.checkpointId ? { connect: { id: value.checkpointId } } : undefined,
      },
      update: {
        status: value.status,
        attempt: value.attempt,
        reason: value.reason,
        restoredStepIds: value.restoredStepIds,
        errorMessage: value.errorMessage,
        startedAt: value.startedAt,
        completedAt: value.completedAt,
        checkpoint: value.checkpointId
          ? { connect: { id: value.checkpointId } }
          : { disconnect: true },
      },
    });
    return this.entity.rehydrate({
      ...persisted,
      status: persisted.status as WorkflowRecoveryStatus,
    });
  }

  async findById(id: string): Promise<WorkflowRecoveryPersistenceRecord | null> {
    const record = await this.prisma.workflowRecoveryPersistence.findUnique({ where: { id: id.trim() } });
    return record ? this.entity.rehydrate({ ...record, status: record.status as WorkflowRecoveryStatus }) : null;
  }

  async listByExecutionId(executionId: string): Promise<WorkflowRecoveryPersistenceRecord[]> {
    const records = await this.prisma.workflowRecoveryPersistence.findMany({
      where: { executionId: executionId.trim() },
      orderBy: { requestedAt: 'asc' },
    });
    return records.map((record) => this.entity.rehydrate({ ...record, status: record.status as WorkflowRecoveryStatus }));
  }

  async listByStatus(status: WorkflowRecoveryStatus): Promise<WorkflowRecoveryPersistenceRecord[]> {
    const records = await this.prisma.workflowRecoveryPersistence.findMany({
      where: { status },
      orderBy: { requestedAt: 'asc' },
    });
    return records.map((record) => this.entity.rehydrate({ ...record, status: record.status as WorkflowRecoveryStatus }));
  }

  async findLatestByExecutionId(executionId: string): Promise<WorkflowRecoveryPersistenceRecord | null> {
    const record = await this.prisma.workflowRecoveryPersistence.findFirst({
      where: { executionId: executionId.trim() },
      orderBy: { requestedAt: 'desc' },
    });
    return record ? this.entity.rehydrate({ ...record, status: record.status as WorkflowRecoveryStatus }) : null;
  }
}