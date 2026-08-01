import { UnitEconomicsIntelligenceStageService } from './unit-economics-intelligence-stage.service';

describe('UnitEconomicsIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(UnitEconomicsIntelligenceStageService).toBeDefined();
    expect(typeof UnitEconomicsIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(UnitEconomicsIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (UnitEconomicsIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(UnitEconomicsIntelligenceStageService.name).toBe('UnitEconomicsIntelligenceStageService');
  });
});