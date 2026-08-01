import { ProductionIntelligenceService } from './production-intelligence.service';

describe('ProductionIntelligenceService', () => {
  it('exports the current service class', () => {
    expect(ProductionIntelligenceService).toBeDefined();
    expect(typeof ProductionIntelligenceService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ProductionIntelligenceService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ProductionIntelligenceService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});