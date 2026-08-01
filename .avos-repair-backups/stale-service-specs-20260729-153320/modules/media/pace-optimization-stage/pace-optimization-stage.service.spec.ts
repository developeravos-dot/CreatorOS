import { PaceOptimizationStageService } from './pace-optimization-stage.service';

describe('PaceOptimizationStageService', () => {
  it('should expose the current service class', () => {
    expect(PaceOptimizationStageService).toBeDefined();
    expect(typeof PaceOptimizationStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(PaceOptimizationStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (PaceOptimizationStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(PaceOptimizationStageService.name).toBe('PaceOptimizationStageService');
  });
});