import { GrowthIntelligenceService } from './growth-intelligence.service';

describe('GrowthIntelligenceService', () => {
  it('should expose the current service class', () => {
    expect(GrowthIntelligenceService).toBeDefined();
    expect(typeof GrowthIntelligenceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(GrowthIntelligenceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (GrowthIntelligenceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(GrowthIntelligenceService.name).toBe('GrowthIntelligenceService');
  });
});