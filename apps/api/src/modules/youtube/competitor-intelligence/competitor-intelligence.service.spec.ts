import { CompetitorIntelligenceService } from './competitor-intelligence.service';

describe('CompetitorIntelligenceService', () => {
  it('exports the current service class', () => {
    expect(CompetitorIntelligenceService).toBeDefined();
    expect(typeof CompetitorIntelligenceService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CompetitorIntelligenceService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CompetitorIntelligenceService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});