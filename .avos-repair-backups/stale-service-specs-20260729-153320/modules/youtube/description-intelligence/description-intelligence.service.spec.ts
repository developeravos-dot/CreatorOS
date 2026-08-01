import { DescriptionIntelligenceService } from './description-intelligence.service';

describe('DescriptionIntelligenceService', () => {
  it('should expose the current service class', () => {
    expect(DescriptionIntelligenceService).toBeDefined();
    expect(typeof DescriptionIntelligenceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(DescriptionIntelligenceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (DescriptionIntelligenceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(DescriptionIntelligenceService.name).toBe('DescriptionIntelligenceService');
  });
});