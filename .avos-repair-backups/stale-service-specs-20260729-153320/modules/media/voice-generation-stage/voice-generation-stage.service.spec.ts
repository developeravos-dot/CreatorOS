import { VoiceGenerationStageService } from './voice-generation-stage.service';

describe('VoiceGenerationStageService', () => {
  it('should expose the current service class', () => {
    expect(VoiceGenerationStageService).toBeDefined();
    expect(typeof VoiceGenerationStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(VoiceGenerationStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (VoiceGenerationStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(VoiceGenerationStageService.name).toBe('VoiceGenerationStageService');
  });
});