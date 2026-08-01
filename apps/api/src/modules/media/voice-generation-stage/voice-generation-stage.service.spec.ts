import { VoiceGenerationStageService } from './voice-generation-stage.service';

describe('VoiceGenerationStageService', () => {
  it('exports the current service class', () => {
    expect(VoiceGenerationStageService).toBeDefined();
    expect(typeof VoiceGenerationStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = VoiceGenerationStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(VoiceGenerationStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});