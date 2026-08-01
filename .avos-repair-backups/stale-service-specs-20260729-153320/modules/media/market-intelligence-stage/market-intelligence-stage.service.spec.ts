import { MarketIntelligenceStageService } from './market-intelligence-stage.service';

describe('MarketIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(MarketIntelligenceStageService).toBeDefined();
    expect(typeof MarketIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(MarketIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (MarketIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(MarketIntelligenceStageService.name).toBe('MarketIntelligenceStageService');
  });
});