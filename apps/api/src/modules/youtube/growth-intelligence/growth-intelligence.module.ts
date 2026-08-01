import { Module } from '@nestjs/common';

import {
  GrowthIntelligenceController,
} from './growth-intelligence.controller';

import {
  GrowthIntelligenceService,
} from './growth-intelligence.service';

@Module({
  controllers: [GrowthIntelligenceController],
  providers: [GrowthIntelligenceService],
  exports: [GrowthIntelligenceService],
})
export class GrowthIntelligenceModule {}
