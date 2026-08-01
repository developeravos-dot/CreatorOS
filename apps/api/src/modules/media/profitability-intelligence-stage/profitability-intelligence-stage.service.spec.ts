import { ProfitabilityIntelligenceStageService } from './profitability-intelligence-stage.service';

describe('ProfitabilityIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(ProfitabilityIntelligenceStageService).toBeDefined();
    expect(typeof ProfitabilityIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ProfitabilityIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ProfitabilityIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});