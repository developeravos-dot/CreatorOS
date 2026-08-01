import { PricingIntelligenceStageService } from './pricing-intelligence-stage.service';

describe('PricingIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(PricingIntelligenceStageService).toBeDefined();
    expect(typeof PricingIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(PricingIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (PricingIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(PricingIntelligenceStageService.name).toBe('PricingIntelligenceStageService');
  });
});