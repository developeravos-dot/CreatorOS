import { Module } from '@nestjs/common';

import {
  UnifiedMediaAnalyticsEngineModule,
} from '../unified-media-analytics-engine/unified-media-analytics-engine.module';

import {
  AudienceIntelligenceEngineModule,
} from '../audience-intelligence-engine/audience-intelligence-engine.module';

import {
  TrendOpportunityRadarEngineModule,
} from '../trend-opportunity-radar-engine/trend-opportunity-radar-engine.module';

import {
  PredictivePerformanceEngineModule,
} from '../predictive-performance-engine/predictive-performance-engine.module';

import {
  ExecutiveDecisionIntelligenceEngineModule,
} from '../executive-decision-intelligence-engine/executive-decision-intelligence-engine.module';

@Module({
  imports: [
    UnifiedMediaAnalyticsEngineModule,
    AudienceIntelligenceEngineModule,
    TrendOpportunityRadarEngineModule,
    PredictivePerformanceEngineModule,
    ExecutiveDecisionIntelligenceEngineModule,
  ],
  exports: [
    UnifiedMediaAnalyticsEngineModule,
    AudienceIntelligenceEngineModule,
    TrendOpportunityRadarEngineModule,
    PredictivePerformanceEngineModule,
    ExecutiveDecisionIntelligenceEngineModule,
  ],
})
export class AvosMediaIntelligenceMegaModule {}
