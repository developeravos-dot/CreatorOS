import { Module } from '@nestjs/common';
import { AnimationIntelligenceStageController } from './animation-intelligence-stage.controller';
import { AnimationIntelligenceStageService } from './animation-intelligence-stage.service';

@Module({
  controllers: [AnimationIntelligenceStageController],
  providers: [AnimationIntelligenceStageService],
  exports: [AnimationIntelligenceStageService],
})
export class AnimationIntelligenceStageModule {}
