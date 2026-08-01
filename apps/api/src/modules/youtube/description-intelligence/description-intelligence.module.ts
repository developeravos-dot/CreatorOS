import { Module } from '@nestjs/common';

import {
  DescriptionIntelligenceController,
} from './description-intelligence.controller';

import {
  DescriptionIntelligenceService,
} from './description-intelligence.service';

@Module({
  controllers: [DescriptionIntelligenceController],
  providers: [DescriptionIntelligenceService],
  exports: [DescriptionIntelligenceService],
})
export class DescriptionIntelligenceModule {}
