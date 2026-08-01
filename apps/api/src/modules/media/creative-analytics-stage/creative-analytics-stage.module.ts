import { Module } from '@nestjs/common';
import { CreativeAnalyticsStageController } from './creative-analytics-stage.controller';
import { CreativeAnalyticsStageService } from './creative-analytics-stage.service';

@Module({
  controllers: [CreativeAnalyticsStageController],
  providers: [CreativeAnalyticsStageService],
  exports: [CreativeAnalyticsStageService],
})
export class CreativeAnalyticsStageModule {}
