import { Module } from '@nestjs/common';

import {
  MarketPerformanceIntelligenceStageController,
} from './market-performance-intelligence-stage.controller';

import {
  MarketPerformanceIntelligenceStageService,
} from './market-performance-intelligence-stage.service';

@Module({
  controllers: [MarketPerformanceIntelligenceStageController],
  providers: [MarketPerformanceIntelligenceStageService],
  exports: [MarketPerformanceIntelligenceStageService],
})
export class MarketPerformanceIntelligenceStageModule {}
