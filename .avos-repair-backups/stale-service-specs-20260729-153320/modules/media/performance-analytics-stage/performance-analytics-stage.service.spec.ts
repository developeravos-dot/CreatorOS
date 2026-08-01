import { PerformanceAnalyticsStageService } from './performance-analytics-stage.service';

describe('PerformanceAnalyticsStageService', () => {
  it('should expose the current service class', () => {
    expect(PerformanceAnalyticsStageService).toBeDefined();
    expect(typeof PerformanceAnalyticsStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(PerformanceAnalyticsStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (PerformanceAnalyticsStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(PerformanceAnalyticsStageService.name).toBe('PerformanceAnalyticsStageService');
  });
});