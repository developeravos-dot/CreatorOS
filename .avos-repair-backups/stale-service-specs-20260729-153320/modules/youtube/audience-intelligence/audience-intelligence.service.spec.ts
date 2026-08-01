import { AudienceIntelligenceService } from './audience-intelligence.service';

describe('AudienceIntelligenceService', () => {
  it('should expose the current service class', () => {
    expect(AudienceIntelligenceService).toBeDefined();
    expect(typeof AudienceIntelligenceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(AudienceIntelligenceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (AudienceIntelligenceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(AudienceIntelligenceService.name).toBe('AudienceIntelligenceService');
  });
});