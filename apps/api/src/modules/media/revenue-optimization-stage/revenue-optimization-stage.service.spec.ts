import { RevenueOptimizationStageService } from './revenue-optimization-stage.service';

describe('RevenueOptimizationStageService', () => {
  it('exports the current service class', () => {
    expect(RevenueOptimizationStageService).toBeDefined();
    expect(typeof RevenueOptimizationStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = RevenueOptimizationStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(RevenueOptimizationStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});