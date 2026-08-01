import { SeoIntelligenceService } from './seo-intelligence.service';

describe('SeoIntelligenceService', () => {
  it('should expose the current service class', () => {
    expect(SeoIntelligenceService).toBeDefined();
    expect(typeof SeoIntelligenceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(SeoIntelligenceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (SeoIntelligenceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(SeoIntelligenceService.name).toBe('SeoIntelligenceService');
  });
});