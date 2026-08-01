import { Module } from '@nestjs/common';
import { VoiceCastingStageController } from './voice-casting-stage.controller';
import { VoiceCastingStageService } from './voice-casting-stage.service';

@Module({
  controllers: [VoiceCastingStageController],
  providers: [VoiceCastingStageService],
  exports: [VoiceCastingStageService],
})
export class VoiceCastingStageModule {}
