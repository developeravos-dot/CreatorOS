import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import { PrismaService } from '../../../../../modules/persistence';
import { WorkflowEventEntity, WorkflowEventPersistenceRecord } from '../entities';

@Injectable()
export class WorkflowEventRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly entity: WorkflowEventEntity,
  ) {}

  async append(record: WorkflowEventPersistenceRecord): Promise<WorkflowEventPersistenceRecord> {
    const value = this.entity.rehydrate(record);
    const persisted = await this.prisma.workflowEventPersistence.create({
      data: {
        id: value.id,
        sequence: value.sequence,
        type: value.type,
        payload: value.payload as Prisma.InputJsonValue,
        metadata: value.metadata as Prisma.InputJsonValue,
        occurredAt: value.occurredAt,
        execution: { connect: { id: value.executionId } },
      },
    });
    return this.fromPrisma(persisted);
  }

  async findById(id: string): Promise<WorkflowEventPersistenceRecord | null> {
    const record = await this.prisma.workflowEventPersistence.findUnique({ where: { id: id.trim() } });
    return record ? this.fromPrisma(record) : null;
  }

  async listByExecutionId(executionId: string, afterSequence = 0): Promise<WorkflowEventPersistenceRecord[]> {
    const records = await this.prisma.workflowEventPersistence.findMany({
      where: { executionId: executionId.trim(), sequence: { gt: afterSequence } },
      orderBy: { sequence: 'asc' },
    });
    return records.map((record) => this.fromPrisma(record));
  }

  async nextSequence(executionId: string): Promise<number> {
    const record = await this.prisma.workflowEventPersistence.findFirst({
      where: { executionId: executionId.trim() },
      orderBy: { sequence: 'desc' },
      select: { sequence: true },
    });
    return record ? record.sequence + 1 : 1;
  }

  private fromPrisma(record: {
    id: string; executionId: string; sequence: number; type: string;
    payload: Prisma.JsonValue; metadata: Prisma.JsonValue; occurredAt: Date;
  }): WorkflowEventPersistenceRecord {
    return this.entity.rehydrate({
      ...record,
      payload: record.payload as Record<string, unknown>,
      metadata: record.metadata as Record<string, unknown>,
    });
  }
}