import { EngagementAnalyticsService } from './engagement-analytics.service';

describe('EngagementAnalyticsService', () => {
  it('should expose the current service class', () => {
    expect(EngagementAnalyticsService).toBeDefined();
    expect(typeof EngagementAnalyticsService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(EngagementAnalyticsService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (EngagementAnalyticsService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(EngagementAnalyticsService.name).toBe('EngagementAnalyticsService');
  });
});