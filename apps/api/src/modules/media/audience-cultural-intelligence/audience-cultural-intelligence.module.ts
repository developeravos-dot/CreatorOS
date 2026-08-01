import { Module } from '@nestjs/common';

import {
  AudienceCulturalIntelligenceController,
} from './audience-cultural-intelligence.controller';

import {
  AudienceCulturalIntelligenceService,
} from './audience-cultural-intelligence.service';

@Module({
  controllers: [AudienceCulturalIntelligenceController],
  providers: [AudienceCulturalIntelligenceService],
  exports: [AudienceCulturalIntelligenceService],
})
export class AudienceCulturalIntelligenceModule {}
