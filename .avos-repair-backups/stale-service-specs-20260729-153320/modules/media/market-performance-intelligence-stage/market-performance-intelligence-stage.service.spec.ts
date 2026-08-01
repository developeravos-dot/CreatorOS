import { MarketPerformanceIntelligenceStageService } from './market-performance-intelligence-stage.service';

describe('MarketPerformanceIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(MarketPerformanceIntelligenceStageService).toBeDefined();
    expect(typeof MarketPerformanceIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(MarketPerformanceIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (MarketPerformanceIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(MarketPerformanceIntelligenceStageService.name).toBe('MarketPerformanceIntelligenceStageService');
  });
});