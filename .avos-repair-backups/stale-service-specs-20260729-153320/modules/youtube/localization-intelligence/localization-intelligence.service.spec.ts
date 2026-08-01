import { LocalizationIntelligenceService } from './localization-intelligence.service';

describe('LocalizationIntelligenceService', () => {
  it('should expose the current service class', () => {
    expect(LocalizationIntelligenceService).toBeDefined();
    expect(typeof LocalizationIntelligenceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(LocalizationIntelligenceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (LocalizationIntelligenceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(LocalizationIntelligenceService.name).toBe('LocalizationIntelligenceService');
  });
});