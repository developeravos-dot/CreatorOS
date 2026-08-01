import { CreativeProductionIntelligenceService } from './creative-production-intelligence.service';

describe('CreativeProductionIntelligenceService', () => {
  it('exports the current service class', () => {
    expect(CreativeProductionIntelligenceService).toBeDefined();
    expect(typeof CreativeProductionIntelligenceService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CreativeProductionIntelligenceService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CreativeProductionIntelligenceService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});