import { PartnershipIntelligenceService } from './partnership-intelligence.service';

describe('PartnershipIntelligenceService', () => {
  it('should expose the current service class', () => {
    expect(PartnershipIntelligenceService).toBeDefined();
    expect(typeof PartnershipIntelligenceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(PartnershipIntelligenceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (PartnershipIntelligenceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(PartnershipIntelligenceService.name).toBe('PartnershipIntelligenceService');
  });
});