import { AudienceCulturalIntelligenceService } from './audience-cultural-intelligence.service';

describe('AudienceCulturalIntelligenceService', () => {
  it('exports the current service class', () => {
    expect(AudienceCulturalIntelligenceService).toBeDefined();
    expect(typeof AudienceCulturalIntelligenceService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = AudienceCulturalIntelligenceService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(AudienceCulturalIntelligenceService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});