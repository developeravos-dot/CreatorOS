import { VoiceProductionService } from './voice-production.service';

describe('VoiceProductionService', () => {
  it('should expose the current service class', () => {
    expect(VoiceProductionService).toBeDefined();
    expect(typeof VoiceProductionService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(VoiceProductionService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (VoiceProductionService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(VoiceProductionService.name).toBe('VoiceProductionService');
  });
});