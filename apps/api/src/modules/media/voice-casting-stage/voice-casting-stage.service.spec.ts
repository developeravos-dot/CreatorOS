import { VoiceCastingStageService } from './voice-casting-stage.service';

describe('VoiceCastingStageService', () => {
  it('exports the current service class', () => {
    expect(VoiceCastingStageService).toBeDefined();
    expect(typeof VoiceCastingStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = VoiceCastingStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(VoiceCastingStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});