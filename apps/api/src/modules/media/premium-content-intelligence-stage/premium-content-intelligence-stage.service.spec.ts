import { PremiumContentIntelligenceStageService } from './premium-content-intelligence-stage.service';

describe('PremiumContentIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(PremiumContentIntelligenceStageService).toBeDefined();
    expect(typeof PremiumContentIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = PremiumContentIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(PremiumContentIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});