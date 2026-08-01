import { ProductionIntelligenceService } from './production-intelligence.service';

describe('ProductionIntelligenceService', () => {
  it('should expose the current service class', () => {
    expect(ProductionIntelligenceService).toBeDefined();
    expect(typeof ProductionIntelligenceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ProductionIntelligenceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ProductionIntelligenceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ProductionIntelligenceService.name).toBe('ProductionIntelligenceService');
  });
});