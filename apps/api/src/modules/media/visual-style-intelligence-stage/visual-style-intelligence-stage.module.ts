import { Module } from '@nestjs/common';
import { VisualStyleIntelligenceStageController } from './visual-style-intelligence-stage.controller';
import { VisualStyleIntelligenceStageService } from './visual-style-intelligence-stage.service';

@Module({
  controllers: [VisualStyleIntelligenceStageController],
  providers: [VisualStyleIntelligenceStageService],
  exports: [VisualStyleIntelligenceStageService],
})
export class VisualStyleIntelligenceStageModule {}
