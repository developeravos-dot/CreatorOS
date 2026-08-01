import { MarketOpportunityAnalysisStageService } from './market-opportunity-analysis-stage.service';

describe('MarketOpportunityAnalysisStageService', () => {
  it('should expose the current service class', () => {
    expect(MarketOpportunityAnalysisStageService).toBeDefined();
    expect(typeof MarketOpportunityAnalysisStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(MarketOpportunityAnalysisStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (MarketOpportunityAnalysisStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(MarketOpportunityAnalysisStageService.name).toBe('MarketOpportunityAnalysisStageService');
  });
});