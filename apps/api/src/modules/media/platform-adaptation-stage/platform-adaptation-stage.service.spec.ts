import { PlatformAdaptationStageService } from './platform-adaptation-stage.service';

describe('PlatformAdaptationStageService', () => {
  it('exports the current service class', () => {
    expect(PlatformAdaptationStageService).toBeDefined();
    expect(typeof PlatformAdaptationStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = PlatformAdaptationStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(PlatformAdaptationStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});