import { Module } from '@nestjs/common';
import { PerformanceAnalyticsStageController } from './performance-analytics-stage.controller';
import { PerformanceAnalyticsStageService } from './performance-analytics-stage.service';

@Module({
  controllers: [PerformanceAnalyticsStageController],
  providers: [PerformanceAnalyticsStageService],
  exports: [PerformanceAnalyticsStageService],
})
export class PerformanceAnalyticsStageModule {}
