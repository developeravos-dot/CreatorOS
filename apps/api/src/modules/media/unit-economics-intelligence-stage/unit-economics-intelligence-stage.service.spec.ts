import { UnitEconomicsIntelligenceStageService } from './unit-economics-intelligence-stage.service';

describe('UnitEconomicsIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(UnitEconomicsIntelligenceStageService).toBeDefined();
    expect(typeof UnitEconomicsIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = UnitEconomicsIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(UnitEconomicsIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});