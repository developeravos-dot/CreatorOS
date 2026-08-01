import { VoiceProductionService } from './voice-production.service';

describe('VoiceProductionService', () => {
  it('exports the current service class', () => {
    expect(VoiceProductionService).toBeDefined();
    expect(typeof VoiceProductionService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = VoiceProductionService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(VoiceProductionService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});