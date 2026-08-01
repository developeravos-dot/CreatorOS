import { PaceOptimizationStageService } from './pace-optimization-stage.service';

describe('PaceOptimizationStageService', () => {
  it('exports the current service class', () => {
    expect(PaceOptimizationStageService).toBeDefined();
    expect(typeof PaceOptimizationStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = PaceOptimizationStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(PaceOptimizationStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});