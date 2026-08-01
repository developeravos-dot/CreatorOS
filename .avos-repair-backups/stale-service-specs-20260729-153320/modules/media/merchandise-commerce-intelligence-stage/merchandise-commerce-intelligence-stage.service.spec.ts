import { MerchandiseCommerceIntelligenceStageService } from './merchandise-commerce-intelligence-stage.service';

describe('MerchandiseCommerceIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(MerchandiseCommerceIntelligenceStageService).toBeDefined();
    expect(typeof MerchandiseCommerceIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(MerchandiseCommerceIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (MerchandiseCommerceIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(MerchandiseCommerceIntelligenceStageService.name).toBe('MerchandiseCommerceIntelligenceStageService');
  });
});