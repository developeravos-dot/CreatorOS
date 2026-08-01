import { Module } from '@nestjs/common';

import {
  StoryFormatIntelligenceController,
} from './story-format-intelligence.controller';

import {
  StoryFormatIntelligenceService,
} from './story-format-intelligence.service';

@Module({
  controllers: [StoryFormatIntelligenceController],
  providers: [StoryFormatIntelligenceService],
  exports: [StoryFormatIntelligenceService],
})
export class StoryFormatIntelligenceModule {}
