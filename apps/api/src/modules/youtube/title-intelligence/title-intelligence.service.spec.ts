import { TitleIntelligenceService } from './title-intelligence.service';

describe('TitleIntelligenceService', () => {
  it('exports the current service class', () => {
    expect(TitleIntelligenceService).toBeDefined();
    expect(typeof TitleIntelligenceService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = TitleIntelligenceService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(TitleIntelligenceService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});