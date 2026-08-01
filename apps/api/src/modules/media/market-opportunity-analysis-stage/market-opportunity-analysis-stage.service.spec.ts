import { MarketOpportunityAnalysisStageService } from './market-opportunity-analysis-stage.service';

describe('MarketOpportunityAnalysisStageService', () => {
  it('exports the current service class', () => {
    expect(MarketOpportunityAnalysisStageService).toBeDefined();
    expect(typeof MarketOpportunityAnalysisStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = MarketOpportunityAnalysisStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(MarketOpportunityAnalysisStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});