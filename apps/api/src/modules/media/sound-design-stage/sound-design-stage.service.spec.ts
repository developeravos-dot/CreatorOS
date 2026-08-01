import { SoundDesignStageService } from './sound-design-stage.service';

describe('SoundDesignStageService', () => {
  it('exports the current service class', () => {
    expect(SoundDesignStageService).toBeDefined();
    expect(typeof SoundDesignStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = SoundDesignStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(SoundDesignStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});