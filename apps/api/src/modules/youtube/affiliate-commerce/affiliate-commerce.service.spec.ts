import { AffiliateCommerceService } from './affiliate-commerce.service';

describe('AffiliateCommerceService', () => {
  it('exports the current service class', () => {
    expect(AffiliateCommerceService).toBeDefined();
    expect(typeof AffiliateCommerceService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = AffiliateCommerceService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(AffiliateCommerceService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});