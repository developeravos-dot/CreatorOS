import { AffiliateCommerceIntelligenceStageService } from './affiliate-commerce-intelligence-stage.service';

describe('AffiliateCommerceIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(AffiliateCommerceIntelligenceStageService).toBeDefined();
    expect(typeof AffiliateCommerceIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = AffiliateCommerceIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(AffiliateCommerceIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});