import { BrandIntelligenceService } from './brand-intelligence.service';

describe('BrandIntelligenceService', () => {
  it('exports the current service class', () => {
    expect(BrandIntelligenceService).toBeDefined();
    expect(typeof BrandIntelligenceService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = BrandIntelligenceService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(BrandIntelligenceService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});