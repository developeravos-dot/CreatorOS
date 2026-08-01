import { GrowthIntelligenceService } from './growth-intelligence.service';

describe('GrowthIntelligenceService', () => {
  it('exports the current service class', () => {
    expect(GrowthIntelligenceService).toBeDefined();
    expect(typeof GrowthIntelligenceService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = GrowthIntelligenceService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(GrowthIntelligenceService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});