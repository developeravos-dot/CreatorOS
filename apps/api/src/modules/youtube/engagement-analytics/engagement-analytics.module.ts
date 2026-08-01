import { Module } from '@nestjs/common';

import {
  EngagementAnalyticsController,
} from './engagement-analytics.controller';

import {
  EngagementAnalyticsService,
} from './engagement-analytics.service';

@Module({
  controllers: [EngagementAnalyticsController],
  providers: [EngagementAnalyticsService],
  exports: [EngagementAnalyticsService],
})
export class EngagementAnalyticsModule {}
