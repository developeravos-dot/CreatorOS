import { Module } from '@nestjs/common';

import {
  VoiceSoundMusicIntelligenceController,
} from './voice-sound-music-intelligence.controller';

import {
  VoiceSoundMusicIntelligenceService,
} from './voice-sound-music-intelligence.service';

@Module({
  controllers: [VoiceSoundMusicIntelligenceController],
  providers: [VoiceSoundMusicIntelligenceService],
  exports: [VoiceSoundMusicIntelligenceService],
})
export class VoiceSoundMusicIntelligenceModule {}
