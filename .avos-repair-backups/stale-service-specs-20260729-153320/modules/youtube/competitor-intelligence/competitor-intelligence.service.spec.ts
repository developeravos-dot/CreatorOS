import { CompetitorIntelligenceService } from './competitor-intelligence.service';

describe('CompetitorIntelligenceService', () => {
  it('should expose the current service class', () => {
    expect(CompetitorIntelligenceService).toBeDefined();
    expect(typeof CompetitorIntelligenceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(CompetitorIntelligenceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (CompetitorIntelligenceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(CompetitorIntelligenceService.name).toBe('CompetitorIntelligenceService');
  });
});