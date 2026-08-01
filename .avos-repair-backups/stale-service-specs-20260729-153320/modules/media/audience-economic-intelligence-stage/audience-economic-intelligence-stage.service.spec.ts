import { AudienceEconomicIntelligenceStageService } from './audience-economic-intelligence-stage.service';

describe('AudienceEconomicIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(AudienceEconomicIntelligenceStageService).toBeDefined();
    expect(typeof AudienceEconomicIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(AudienceEconomicIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (AudienceEconomicIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(AudienceEconomicIntelligenceStageService.name).toBe('AudienceEconomicIntelligenceStageService');
  });
});