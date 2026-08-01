import { Module } from '@nestjs/common';

import {
  UnifiedMediaAnalyticsEngineController,
} from './unified-media-analytics-engine.controller';

import {
  UnifiedMediaAnalyticsEngineService,
} from './unified-media-analytics-engine.service';

@Module({
  controllers: [UnifiedMediaAnalyticsEngineController],
  providers: [UnifiedMediaAnalyticsEngineService],
  exports: [UnifiedMediaAnalyticsEngineService],
})
export class UnifiedMediaAnalyticsEngineModule {}
