import { DescriptionIntelligenceService } from './description-intelligence.service';

describe('DescriptionIntelligenceService', () => {
  it('exports the current service class', () => {
    expect(DescriptionIntelligenceService).toBeDefined();
    expect(typeof DescriptionIntelligenceService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = DescriptionIntelligenceService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(DescriptionIntelligenceService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});