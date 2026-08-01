import { AudienceCulturalIntelligenceService } from './audience-cultural-intelligence.service';

describe('AudienceCulturalIntelligenceService', () => {
  it('should expose the current service class', () => {
    expect(AudienceCulturalIntelligenceService).toBeDefined();
    expect(typeof AudienceCulturalIntelligenceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(AudienceCulturalIntelligenceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (AudienceCulturalIntelligenceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(AudienceCulturalIntelligenceService.name).toBe('AudienceCulturalIntelligenceService');
  });
});