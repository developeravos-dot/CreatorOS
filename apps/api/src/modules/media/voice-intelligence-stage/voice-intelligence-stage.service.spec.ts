import { VoiceIntelligenceStageService } from './voice-intelligence-stage.service';

describe('VoiceIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(VoiceIntelligenceStageService).toBeDefined();
    expect(typeof VoiceIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = VoiceIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(VoiceIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});