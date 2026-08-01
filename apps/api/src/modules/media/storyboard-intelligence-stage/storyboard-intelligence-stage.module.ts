import { Module } from '@nestjs/common';
import { StoryboardIntelligenceStageController } from './storyboard-intelligence-stage.controller';
import { StoryboardIntelligenceStageService } from './storyboard-intelligence-stage.service';

@Module({
  controllers: [StoryboardIntelligenceStageController],
  providers: [StoryboardIntelligenceStageService],
  exports: [StoryboardIntelligenceStageService],
})
export class StoryboardIntelligenceStageModule {}
