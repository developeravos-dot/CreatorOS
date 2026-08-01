import { RevenueIntelligenceService } from './revenue-intelligence.service';

describe('RevenueIntelligenceService', () => {
  it('should expose the current service class', () => {
    expect(RevenueIntelligenceService).toBeDefined();
    expect(typeof RevenueIntelligenceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(RevenueIntelligenceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (RevenueIntelligenceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(RevenueIntelligenceService.name).toBe('RevenueIntelligenceService');
  });
});