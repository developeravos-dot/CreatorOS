import { PremiumContentIntelligenceStageService } from './premium-content-intelligence-stage.service';

describe('PremiumContentIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(PremiumContentIntelligenceStageService).toBeDefined();
    expect(typeof PremiumContentIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(PremiumContentIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (PremiumContentIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(PremiumContentIntelligenceStageService.name).toBe('PremiumContentIntelligenceStageService');
  });
});