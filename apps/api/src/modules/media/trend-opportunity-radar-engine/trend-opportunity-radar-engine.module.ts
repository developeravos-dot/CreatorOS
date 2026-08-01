import { Module } from '@nestjs/common';

import {
  TrendOpportunityRadarEngineController,
} from './trend-opportunity-radar-engine.controller';

import {
  TrendOpportunityRadarEngineService,
} from './trend-opportunity-radar-engine.service';

@Module({
  controllers: [TrendOpportunityRadarEngineController],
  providers: [TrendOpportunityRadarEngineService],
  exports: [TrendOpportunityRadarEngineService],
})
export class TrendOpportunityRadarEngineModule {}
