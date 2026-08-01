import { Module } from '@nestjs/common';

import {
  PartnershipIntelligenceController,
} from './partnership-intelligence.controller';

import {
  PartnershipIntelligenceService,
} from './partnership-intelligence.service';

@Module({
  controllers: [PartnershipIntelligenceController],
  providers: [PartnershipIntelligenceService],
  exports: [PartnershipIntelligenceService],
})
export class PartnershipIntelligenceModule {}
