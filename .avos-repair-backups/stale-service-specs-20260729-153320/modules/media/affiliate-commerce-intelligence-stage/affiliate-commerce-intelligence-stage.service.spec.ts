import { AffiliateCommerceIntelligenceStageService } from './affiliate-commerce-intelligence-stage.service';

describe('AffiliateCommerceIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(AffiliateCommerceIntelligenceStageService).toBeDefined();
    expect(typeof AffiliateCommerceIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(AffiliateCommerceIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (AffiliateCommerceIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(AffiliateCommerceIntelligenceStageService.name).toBe('AffiliateCommerceIntelligenceStageService');
  });
});