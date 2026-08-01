import { SeoIntelligenceService } from './seo-intelligence.service';

describe('SeoIntelligenceService', () => {
  it('exports the current service class', () => {
    expect(SeoIntelligenceService).toBeDefined();
    expect(typeof SeoIntelligenceService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = SeoIntelligenceService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(SeoIntelligenceService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});