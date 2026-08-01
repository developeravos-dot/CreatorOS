import { Module } from '@nestjs/common';
import { LightingIntelligenceStageController } from './lighting-intelligence-stage.controller';
import { LightingIntelligenceStageService } from './lighting-intelligence-stage.service';

@Module({
  controllers: [LightingIntelligenceStageController],
  providers: [LightingIntelligenceStageService],
  exports: [LightingIntelligenceStageService],
})
export class LightingIntelligenceStageModule {}
