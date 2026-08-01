import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventBus } from '@nestjs/cqrs';
import { OutboxService } from './outbox.service';

@Injectable()
export class OutboxPublisherJob {
  private readonly logger = new Logger(OutboxPublisherJob.name);

  constructor(
    private readonly outbox: OutboxService,
    private readonly eventBus: EventBus,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async run(): Promise<void> {
    const events = await this.outbox.pending(100);

    for (const item of events) {
      try {
        this.eventBus.publish({
          id: item.id,
          name: item.eventName,
          payload: item.payload,
          occurredAt: item.occurredAt,
        });

        await this.outbox.markPublished(item.id);
      }
      catch (error) {
        this.logger.error(
          `Outbox event ${item.id} failed: ${String(error)}`,
        );
      }
    }
  }
}