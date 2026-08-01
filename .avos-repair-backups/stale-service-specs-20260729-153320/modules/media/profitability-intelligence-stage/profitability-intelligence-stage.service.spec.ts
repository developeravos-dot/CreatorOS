import { ProfitabilityIntelligenceStageService } from './profitability-intelligence-stage.service';

describe('ProfitabilityIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(ProfitabilityIntelligenceStageService).toBeDefined();
    expect(typeof ProfitabilityIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ProfitabilityIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ProfitabilityIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ProfitabilityIntelligenceStageService.name).toBe('ProfitabilityIntelligenceStageService');
  });
});