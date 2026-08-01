import { Module } from '@nestjs/common';
import { ScriptIntelligenceStageController } from './script-intelligence-stage.controller';
import { ScriptIntelligenceStageService } from './script-intelligence-stage.service';

@Module({
  controllers: [ScriptIntelligenceStageController],
  providers: [ScriptIntelligenceStageService],
  exports: [ScriptIntelligenceStageService],
})
export class ScriptIntelligenceStageModule {}
