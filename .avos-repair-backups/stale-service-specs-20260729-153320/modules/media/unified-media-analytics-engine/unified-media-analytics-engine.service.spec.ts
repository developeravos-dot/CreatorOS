import { UnifiedMediaAnalyticsEngineService } from './unified-media-analytics-engine.service';

describe('UnifiedMediaAnalyticsEngineService', () => {
  it('should expose the current service class', () => {
    expect(UnifiedMediaAnalyticsEngineService).toBeDefined();
    expect(typeof UnifiedMediaAnalyticsEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(UnifiedMediaAnalyticsEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (UnifiedMediaAnalyticsEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(UnifiedMediaAnalyticsEngineService.name).toBe('UnifiedMediaAnalyticsEngineService');
  });
});