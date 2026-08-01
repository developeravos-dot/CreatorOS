import { Module } from '@nestjs/common';

import {
  PublishingOrchestrationEngineModule,
} from '../publishing-orchestration-engine/publishing-orchestration-engine.module';

import {
  MetadataThumbnailOptimizationModule,
} from '../metadata-thumbnail-optimization/metadata-thumbnail-optimization.module';

import {
  LocalizationGlobalDistributionModule,
} from '../localization-global-distribution/localization-global-distribution.module';

import {
  AudienceGrowthEngineModule,
} from '../audience-growth-engine/audience-growth-engine.module';

import {
  ReleasePerformanceIntelligenceModule,
} from '../release-performance-intelligence/release-performance-intelligence.module';

@Module({
  imports: [
    PublishingOrchestrationEngineModule,
    MetadataThumbnailOptimizationModule,
    LocalizationGlobalDistributionModule,
    AudienceGrowthEngineModule,
    ReleasePerformanceIntelligenceModule,
  ],
  exports: [
    PublishingOrchestrationEngineModule,
    MetadataThumbnailOptimizationModule,
    LocalizationGlobalDistributionModule,
    AudienceGrowthEngineModule,
    ReleasePerformanceIntelligenceModule,
  ],
})
export class AvosMediaPublishingGrowthMegaModule {}
