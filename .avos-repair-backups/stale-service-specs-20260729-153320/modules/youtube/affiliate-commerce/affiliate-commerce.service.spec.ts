import { AffiliateCommerceService } from './affiliate-commerce.service';

describe('AffiliateCommerceService', () => {
  it('should expose the current service class', () => {
    expect(AffiliateCommerceService).toBeDefined();
    expect(typeof AffiliateCommerceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(AffiliateCommerceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (AffiliateCommerceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(AffiliateCommerceService.name).toBe('AffiliateCommerceService');
  });
});