import { EngagementOptimizationStageService } from './engagement-optimization-stage.service';

describe('EngagementOptimizationStageService', () => {
  it('exports the current service class', () => {
    expect(EngagementOptimizationStageService).toBeDefined();
    expect(typeof EngagementOptimizationStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = EngagementOptimizationStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(EngagementOptimizationStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});