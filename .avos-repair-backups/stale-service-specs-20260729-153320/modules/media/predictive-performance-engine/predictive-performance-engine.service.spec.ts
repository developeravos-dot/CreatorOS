import { PredictivePerformanceEngineService } from './predictive-performance-engine.service';

describe('PredictivePerformanceEngineService', () => {
  it('should expose the current service class', () => {
    expect(PredictivePerformanceEngineService).toBeDefined();
    expect(typeof PredictivePerformanceEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(PredictivePerformanceEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (PredictivePerformanceEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(PredictivePerformanceEngineService.name).toBe('PredictivePerformanceEngineService');
  });
});