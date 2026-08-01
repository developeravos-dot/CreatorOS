import { RevenueAttributionStageService } from './revenue-attribution-stage.service';

describe('RevenueAttributionStageService', () => {
  it('should expose the current service class', () => {
    expect(RevenueAttributionStageService).toBeDefined();
    expect(typeof RevenueAttributionStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(RevenueAttributionStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (RevenueAttributionStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(RevenueAttributionStageService.name).toBe('RevenueAttributionStageService');
  });
});