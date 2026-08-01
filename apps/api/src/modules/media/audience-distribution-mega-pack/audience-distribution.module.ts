import { Module } from '@nestjs/common';
import { AudienceIntelligenceService } from './audience/audience-intelligence.service';
import { AudienceDistributionController } from './audience-distribution.controller';
import { AudienceDistributionOrchestratorService } from './audience-distribution-orchestrator.service';
import { CulturalIntelligenceService } from './culture/cultural-intelligence.service';
import { GlobalLocalizationService } from './localization/global-localization.service';
import { PublishingIntelligenceService } from './publishing/publishing-intelligence.service';
import { ContentQualityIntelligenceService } from './quality/content-quality-intelligence.service';
import { ContentSafetyIntelligenceService } from './safety/content-safety-intelligence.service';
import { TrendIntelligenceService } from './trend/trend-intelligence.service';

@Module({
  controllers: [AudienceDistributionController],
  providers: [
    TrendIntelligenceService,
    AudienceIntelligenceService,
    PublishingIntelligenceService,
    GlobalLocalizationService,
    CulturalIntelligenceService,
    ContentQualityIntelligenceService,
    ContentSafetyIntelligenceService,
    AudienceDistributionOrchestratorService,
  ],
  exports: [AudienceDistributionOrchestratorService],
})
export class AudienceDistributionModule {}