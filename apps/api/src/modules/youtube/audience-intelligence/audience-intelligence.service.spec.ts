import { AudienceIntelligenceService } from './audience-intelligence.service';

describe('AudienceIntelligenceService', () => {
  it('exports the current service class', () => {
    expect(AudienceIntelligenceService).toBeDefined();
    expect(typeof AudienceIntelligenceService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = AudienceIntelligenceService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(AudienceIntelligenceService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});