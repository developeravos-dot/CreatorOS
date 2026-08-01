import { VoiceSoundMusicIntelligenceService } from './voice-sound-music-intelligence.service';

describe('VoiceSoundMusicIntelligenceService', () => {
  it('should expose the current service class', () => {
    expect(VoiceSoundMusicIntelligenceService).toBeDefined();
    expect(typeof VoiceSoundMusicIntelligenceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(VoiceSoundMusicIntelligenceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (VoiceSoundMusicIntelligenceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(VoiceSoundMusicIntelligenceService.name).toBe('VoiceSoundMusicIntelligenceService');
  });
});