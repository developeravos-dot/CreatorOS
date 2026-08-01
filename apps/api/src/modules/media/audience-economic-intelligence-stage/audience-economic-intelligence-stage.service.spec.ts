import { AudienceEconomicIntelligenceStageService } from './audience-economic-intelligence-stage.service';

describe('AudienceEconomicIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(AudienceEconomicIntelligenceStageService).toBeDefined();
    expect(typeof AudienceEconomicIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = AudienceEconomicIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(AudienceEconomicIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});