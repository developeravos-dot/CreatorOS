import { EngagementOptimizationStageService } from './engagement-optimization-stage.service';

describe('EngagementOptimizationStageService', () => {
  it('should expose the current service class', () => {
    expect(EngagementOptimizationStageService).toBeDefined();
    expect(typeof EngagementOptimizationStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(EngagementOptimizationStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (EngagementOptimizationStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(EngagementOptimizationStageService.name).toBe('EngagementOptimizationStageService');
  });
});