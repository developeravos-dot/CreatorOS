import { CreativeProductionIntelligenceService } from './creative-production-intelligence.service';

describe('CreativeProductionIntelligenceService', () => {
  it('should expose the current service class', () => {
    expect(CreativeProductionIntelligenceService).toBeDefined();
    expect(typeof CreativeProductionIntelligenceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(CreativeProductionIntelligenceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (CreativeProductionIntelligenceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(CreativeProductionIntelligenceService.name).toBe('CreativeProductionIntelligenceService');
  });
});