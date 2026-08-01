import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  VoiceSoundMusicIntelligenceController,
} from './voice-sound-music-intelligence.controller';

import {
  VoiceSoundMusicIntelligenceService,
} from './voice-sound-music-intelligence.service';

describe('VoiceSoundMusicIntelligenceController', () => {
  let controller: VoiceSoundMusicIntelligenceController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          VoiceSoundMusicIntelligenceController,
        ],
        providers: [
          VoiceSoundMusicIntelligenceService,
        ],
      }).compile();

    controller =
      module.get<VoiceSoundMusicIntelligenceController>(
        VoiceSoundMusicIntelligenceController,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should expose operational dashboard', () => {
    expect(
      controller.getDashboard().status,
    ).toBe('operational');
  });
});
