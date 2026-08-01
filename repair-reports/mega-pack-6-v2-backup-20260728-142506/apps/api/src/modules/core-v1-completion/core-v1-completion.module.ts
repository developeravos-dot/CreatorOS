import { Module } from '@nestjs/common';
import { KnowledgeIntelligenceController } from './knowledge-intelligence/knowledge-intelligence.controller';
import { KnowledgeIntelligenceService } from './knowledge-intelligence/knowledge-intelligence.service';
import { IntegrationsController } from './integrations/integrations.controller';
import { IntegrationsService } from './integrations/integrations.service';

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
import { OperationsController } from './operations/operations.controller';
import { OperationsService } from './operations/operations.service';
import { GovernanceController } from './governance/governance.controller';
import { GovernanceService } from './governance/governance.service';

@Module({
  imports: [CompletionSecurityModule],
  controllers: [
    KnowledgeIntelligenceController,
    IntegrationsController,
    IdentityController,
    MetricsController,
    OperationsController,
    GovernanceController,
  ],
  providers: [
    KnowledgeIntelligenceService,
    IntegrationsService,
    IdentityService,
    RefreshTokenService,
    OutboxService,
    OutboxPublisherJob,
    IdempotencyService,
    QueueService,
    MetricsService,
    OperationsService,
    GovernanceService,
  ],
  exports: [
    KnowledgeIntelligenceService,
    IntegrationsService,
    IdentityService,
    RefreshTokenService,
    OutboxService,
    IdempotencyService,
    QueueService,
    MetricsService,
    OperationsService,
    GovernanceService,
  ],
})
export class CreatorOsCoreV1CompletionModule {}