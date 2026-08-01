import { LicensingIntelligenceService } from './licensing-intelligence.service';

describe('LicensingIntelligenceService', () => {
  it('should expose the current service class', () => {
    expect(LicensingIntelligenceService).toBeDefined();
    expect(typeof LicensingIntelligenceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(LicensingIntelligenceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (LicensingIntelligenceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(LicensingIntelligenceService.name).toBe('LicensingIntelligenceService');
  });
});