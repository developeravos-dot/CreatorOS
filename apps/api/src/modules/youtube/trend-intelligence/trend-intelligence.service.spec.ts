import { TrendIntelligenceService } from './trend-intelligence.service';

describe('TrendIntelligenceService', () => {
  it('exports the current service class', () => {
    expect(TrendIntelligenceService).toBeDefined();
    expect(typeof TrendIntelligenceService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = TrendIntelligenceService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(TrendIntelligenceService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});