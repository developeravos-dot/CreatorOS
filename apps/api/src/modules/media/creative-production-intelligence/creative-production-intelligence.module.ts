import { Module } from '@nestjs/common';

import {
  CreativeProductionIntelligenceController,
} from './creative-production-intelligence.controller';

import {
  CreativeProductionIntelligenceService,
} from './creative-production-intelligence.service';

@Module({
  controllers: [CreativeProductionIntelligenceController],
  providers: [CreativeProductionIntelligenceService],
  exports: [CreativeProductionIntelligenceService],
})
export class CreativeProductionIntelligenceModule {}
