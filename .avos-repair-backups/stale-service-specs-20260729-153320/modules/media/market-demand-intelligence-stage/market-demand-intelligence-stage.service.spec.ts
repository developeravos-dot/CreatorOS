import { MarketDemandIntelligenceStageService } from './market-demand-intelligence-stage.service';

describe('MarketDemandIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(MarketDemandIntelligenceStageService).toBeDefined();
    expect(typeof MarketDemandIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(MarketDemandIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (MarketDemandIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(MarketDemandIntelligenceStageService.name).toBe('MarketDemandIntelligenceStageService');
  });
});