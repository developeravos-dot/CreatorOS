import { Module } from '@nestjs/common';
import { VoiceIntelligenceStageController } from './voice-intelligence-stage.controller';
import { VoiceIntelligenceStageService } from './voice-intelligence-stage.service';

@Module({
  controllers: [VoiceIntelligenceStageController],
  providers: [VoiceIntelligenceStageService],
  exports: [VoiceIntelligenceStageService],
})
export class VoiceIntelligenceStageModule {}
