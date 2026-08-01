import { GrowthOptimizationStageService } from './growth-optimization-stage.service';

describe('GrowthOptimizationStageService', () => {
  it('exports the current service class', () => {
    expect(GrowthOptimizationStageService).toBeDefined();
    expect(typeof GrowthOptimizationStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = GrowthOptimizationStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(GrowthOptimizationStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});