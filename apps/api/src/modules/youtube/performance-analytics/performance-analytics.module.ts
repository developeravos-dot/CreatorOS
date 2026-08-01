import { Module } from '@nestjs/common';

import {
  PerformanceAnalyticsController,
} from './performance-analytics.controller';

import {
  PerformanceAnalyticsService,
} from './performance-analytics.service';

@Module({
  controllers: [PerformanceAnalyticsController],
  providers: [PerformanceAnalyticsService],
  exports: [PerformanceAnalyticsService],
})
export class PerformanceAnalyticsModule {}
