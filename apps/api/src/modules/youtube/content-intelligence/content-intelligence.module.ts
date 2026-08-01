import { Module } from '@nestjs/common';

import {
  ContentIntelligenceController,
} from './content-intelligence.controller';

import {
  ContentIntelligenceService,
} from './content-intelligence.service';

@Module({
  controllers: [ContentIntelligenceController],
  providers: [ContentIntelligenceService],
  exports: [ContentIntelligenceService],
})
export class ContentIntelligenceModule {}
