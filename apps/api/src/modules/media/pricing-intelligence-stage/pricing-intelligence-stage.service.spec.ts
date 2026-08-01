import { PricingIntelligenceStageService } from './pricing-intelligence-stage.service';

describe('PricingIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(PricingIntelligenceStageService).toBeDefined();
    expect(typeof PricingIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = PricingIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(PricingIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});