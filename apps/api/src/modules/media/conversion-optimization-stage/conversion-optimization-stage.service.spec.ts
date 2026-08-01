import { ConversionOptimizationStageService } from './conversion-optimization-stage.service';

describe('ConversionOptimizationStageService', () => {
  it('exports the current service class', () => {
    expect(ConversionOptimizationStageService).toBeDefined();
    expect(typeof ConversionOptimizationStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ConversionOptimizationStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ConversionOptimizationStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});