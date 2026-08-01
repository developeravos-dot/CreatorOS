import { Module } from '@nestjs/common';

import {
  SchedulingEngineModule,
} from '../scheduling-engine/scheduling-engine.module';

import {
  PerformanceAnalyticsModule,
} from '../performance-analytics/performance-analytics.module';

import {
  RecommendationEngineModule,
} from '../recommendation-engine/recommendation-engine.module';

import {
  CompetitorIntelligenceModule,
} from '../competitor-intelligence/competitor-intelligence.module';

import {
  ContentCalendarModule,
} from '../content-calendar/content-calendar.module';

@Module({
  imports: [
    SchedulingEngineModule,
    PerformanceAnalyticsModule,
    RecommendationEngineModule,
    CompetitorIntelligenceModule,
    ContentCalendarModule,
  ],
  exports: [
    SchedulingEngineModule,
    PerformanceAnalyticsModule,
    RecommendationEngineModule,
    CompetitorIntelligenceModule,
    ContentCalendarModule,
  ],
})
export class YoutubeOperationsMegaModule {}
