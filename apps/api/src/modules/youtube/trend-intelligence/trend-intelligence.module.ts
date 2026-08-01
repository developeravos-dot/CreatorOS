import { Module } from '@nestjs/common';

import {
  TrendIntelligenceController,
} from './trend-intelligence.controller';

import {
  TrendIntelligenceService,
} from './trend-intelligence.service';

@Module({
  controllers: [TrendIntelligenceController],
  providers: [TrendIntelligenceService],
  exports: [TrendIntelligenceService],
})
export class TrendIntelligenceModule {}
