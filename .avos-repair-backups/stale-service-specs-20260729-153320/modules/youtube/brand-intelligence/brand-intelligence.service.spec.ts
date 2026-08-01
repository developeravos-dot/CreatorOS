import { BrandIntelligenceService } from './brand-intelligence.service';

describe('BrandIntelligenceService', () => {
  it('should expose the current service class', () => {
    expect(BrandIntelligenceService).toBeDefined();
    expect(typeof BrandIntelligenceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(BrandIntelligenceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (BrandIntelligenceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(BrandIntelligenceService.name).toBe('BrandIntelligenceService');
  });
});