import { Module } from '@nestjs/common';
import { VoiceGenerationStageController } from './voice-generation-stage.controller';
import { VoiceGenerationStageService } from './voice-generation-stage.service';

@Module({
  controllers: [VoiceGenerationStageController],
  providers: [VoiceGenerationStageService],
  exports: [VoiceGenerationStageService],
})
export class VoiceGenerationStageModule {}
