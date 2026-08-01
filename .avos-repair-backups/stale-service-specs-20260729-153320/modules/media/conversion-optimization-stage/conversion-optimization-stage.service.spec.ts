import { ConversionOptimizationStageService } from './conversion-optimization-stage.service';

describe('ConversionOptimizationStageService', () => {
  it('should expose the current service class', () => {
    expect(ConversionOptimizationStageService).toBeDefined();
    expect(typeof ConversionOptimizationStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ConversionOptimizationStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ConversionOptimizationStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ConversionOptimizationStageService.name).toBe('ConversionOptimizationStageService');
  });
});