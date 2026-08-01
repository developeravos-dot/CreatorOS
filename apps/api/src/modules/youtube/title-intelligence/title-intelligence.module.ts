import { Module } from '@nestjs/common';

import {
  TitleIntelligenceController,
} from './title-intelligence.controller';

import {
  TitleIntelligenceService,
} from './title-intelligence.service';

@Module({
  controllers: [TitleIntelligenceController],
  providers: [TitleIntelligenceService],
  exports: [TitleIntelligenceService],
})
export class TitleIntelligenceModule {}
