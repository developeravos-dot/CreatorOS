import { TitleIntelligenceService } from './title-intelligence.service';

describe('TitleIntelligenceService', () => {
  it('should expose the current service class', () => {
    expect(TitleIntelligenceService).toBeDefined();
    expect(typeof TitleIntelligenceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(TitleIntelligenceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (TitleIntelligenceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(TitleIntelligenceService.name).toBe('TitleIntelligenceService');
  });
});