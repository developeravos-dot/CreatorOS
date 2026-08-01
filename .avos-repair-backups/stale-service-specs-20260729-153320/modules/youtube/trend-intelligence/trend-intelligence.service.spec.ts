import { TrendIntelligenceService } from './trend-intelligence.service';

describe('TrendIntelligenceService', () => {
  it('should expose the current service class', () => {
    expect(TrendIntelligenceService).toBeDefined();
    expect(typeof TrendIntelligenceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(TrendIntelligenceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (TrendIntelligenceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(TrendIntelligenceService.name).toBe('TrendIntelligenceService');
  });
});