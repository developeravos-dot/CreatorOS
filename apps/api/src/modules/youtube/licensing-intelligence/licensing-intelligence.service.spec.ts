import { LicensingIntelligenceService } from './licensing-intelligence.service';

describe('LicensingIntelligenceService', () => {
  it('exports the current service class', () => {
    expect(LicensingIntelligenceService).toBeDefined();
    expect(typeof LicensingIntelligenceService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = LicensingIntelligenceService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(LicensingIntelligenceService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});