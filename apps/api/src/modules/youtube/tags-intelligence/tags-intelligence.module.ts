import { Module } from '@nestjs/common';

import {
  TagsIntelligenceController,
} from './tags-intelligence.controller';

import {
  TagsIntelligenceService,
} from './tags-intelligence.service';

@Module({
  controllers: [TagsIntelligenceController],
  providers: [TagsIntelligenceService],
  exports: [TagsIntelligenceService],
})
export class TagsIntelligenceModule {}
