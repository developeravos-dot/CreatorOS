import { MultiplatformAdaptationStageService } from './multiplatform-adaptation-stage.service';

describe('MultiplatformAdaptationStageService', () => {
  it('exports the current service class', () => {
    expect(MultiplatformAdaptationStageService).toBeDefined();
    expect(typeof MultiplatformAdaptationStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = MultiplatformAdaptationStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(MultiplatformAdaptationStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});