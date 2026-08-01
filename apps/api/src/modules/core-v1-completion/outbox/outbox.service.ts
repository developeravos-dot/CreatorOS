import { PrismaService } from '../../persistence/prisma.service';
import { Injectable } from '@nestjs/common';
@Injectable()
export class OutboxService {
  constructor(private readonly persistence: PrismaService) {}

  enqueue(
    eventName: string,
    payload: unknown,
    aggregateType?: string,
    aggregateId?: string,
  ) {
    return this.persistence.creatorOutboxEvent.create({
      data: {
        eventName,
        payload: payload as object,
        aggregateType,
        aggregateId,
      },
    });
  }

  pending(limit = 100) {
    return this.persistence.creatorOutboxEvent.findMany({
      where: { publishedAt: null },
      orderBy: { occurredAt: 'asc' },
      take: limit,
    });
  }

  markPublished(id: string) {
    return this.persistence.creatorOutboxEvent.update({
      where: { id },
      data: { publishedAt: new Date() },
    });
  }
}