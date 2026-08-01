import { VoiceIntelligenceStageService } from './voice-intelligence-stage.service';

describe('VoiceIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(VoiceIntelligenceStageService).toBeDefined();
    expect(typeof VoiceIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(VoiceIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (VoiceIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(VoiceIntelligenceStageService.name).toBe('VoiceIntelligenceStageService');
  });
});