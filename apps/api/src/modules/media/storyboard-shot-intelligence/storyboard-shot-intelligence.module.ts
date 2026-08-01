import { Module } from '@nestjs/common';

import {
  StoryboardShotIntelligenceController,
} from './storyboard-shot-intelligence.controller';

import {
  StoryboardShotIntelligenceService,
} from './storyboard-shot-intelligence.service';

@Module({
  controllers: [StoryboardShotIntelligenceController],
  providers: [StoryboardShotIntelligenceService],
  exports: [StoryboardShotIntelligenceService],
})
export class StoryboardShotIntelligenceModule {}
