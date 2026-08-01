import { Module } from '@nestjs/common';
import { IdentityController } from './identity/identity.controller';
import { IdentityService } from './identity/identity.service';
import { RefreshTokenService } from './tokens/refresh-token.service';
import { OutboxService } from './outbox/outbox.service';
import { OutboxPublisherJob } from './outbox/outbox-publisher.job';
import { IdempotencyService } from './idempotency/idempotency.service';
import { QueueService } from './queue/queue.service';
import { MetricsService } from './metrics/metrics.service';
import { MetricsController } from './metrics/metrics.controller';
import { CompletionSecurityModule } from './security/completion-security.module';

@Module({
  imports: [CompletionSecurityModule],
  controllers: [
    IdentityController,
    MetricsController,
  ],
  providers: [
    IdentityService,
    RefreshTokenService,
    OutboxService,
    OutboxPublisherJob,
    IdempotencyService,
    QueueService,
    MetricsService,
  ],
  exports: [
    IdentityService,
    RefreshTokenService,
    OutboxService,
    IdempotencyService,
    QueueService,
    MetricsService,
  ],
})
export class CreatorOsCoreV1CompletionModule {}