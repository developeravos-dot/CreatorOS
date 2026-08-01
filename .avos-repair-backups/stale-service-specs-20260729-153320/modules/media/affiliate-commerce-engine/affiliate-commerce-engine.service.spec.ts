import { AffiliateCommerceEngineService } from './affiliate-commerce-engine.service';

describe('AffiliateCommerceEngineService', () => {
  it('should expose the current service class', () => {
    expect(AffiliateCommerceEngineService).toBeDefined();
    expect(typeof AffiliateCommerceEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(AffiliateCommerceEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (AffiliateCommerceEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(AffiliateCommerceEngineService.name).toBe('AffiliateCommerceEngineService');
  });
});