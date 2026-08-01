import { Module } from '@nestjs/common';

import {
  AudienceIntelligenceController,
} from './audience-intelligence.controller';

import {
  AudienceIntelligenceService,
} from './audience-intelligence.service';

@Module({
  controllers: [AudienceIntelligenceController],
  providers: [AudienceIntelligenceService],
  exports: [AudienceIntelligenceService],
})
export class AudienceIntelligenceModule {}
