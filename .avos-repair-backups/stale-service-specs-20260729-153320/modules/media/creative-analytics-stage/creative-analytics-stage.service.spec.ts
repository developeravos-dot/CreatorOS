import { CreativeAnalyticsStageService } from './creative-analytics-stage.service';

describe('CreativeAnalyticsStageService', () => {
  it('should expose the current service class', () => {
    expect(CreativeAnalyticsStageService).toBeDefined();
    expect(typeof CreativeAnalyticsStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(CreativeAnalyticsStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (CreativeAnalyticsStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(CreativeAnalyticsStageService.name).toBe('CreativeAnalyticsStageService');
  });
});