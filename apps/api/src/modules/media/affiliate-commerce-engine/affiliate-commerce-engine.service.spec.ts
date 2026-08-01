import { AffiliateCommerceEngineService } from './affiliate-commerce-engine.service';

describe('AffiliateCommerceEngineService', () => {
  it('exports the current service class', () => {
    expect(AffiliateCommerceEngineService).toBeDefined();
    expect(typeof AffiliateCommerceEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = AffiliateCommerceEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(AffiliateCommerceEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});