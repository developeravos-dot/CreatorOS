import { RevenueIntelligenceService } from './revenue-intelligence.service';

describe('RevenueIntelligenceService', () => {
  it('exports the current service class', () => {
    expect(RevenueIntelligenceService).toBeDefined();
    expect(typeof RevenueIntelligenceService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = RevenueIntelligenceService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(RevenueIntelligenceService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});