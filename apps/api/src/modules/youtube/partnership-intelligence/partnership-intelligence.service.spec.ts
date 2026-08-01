import { PartnershipIntelligenceService } from './partnership-intelligence.service';

describe('PartnershipIntelligenceService', () => {
  it('exports the current service class', () => {
    expect(PartnershipIntelligenceService).toBeDefined();
    expect(typeof PartnershipIntelligenceService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = PartnershipIntelligenceService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(PartnershipIntelligenceService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});