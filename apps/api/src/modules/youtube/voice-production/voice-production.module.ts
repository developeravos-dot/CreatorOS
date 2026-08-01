import { Module } from '@nestjs/common';

import {
  VoiceProductionController,
} from './voice-production.controller';

import {
  VoiceProductionService,
} from './voice-production.service';

@Module({
  controllers: [VoiceProductionController],
  providers: [VoiceProductionService],
  exports: [VoiceProductionService],
})
export class VoiceProductionModule {}
