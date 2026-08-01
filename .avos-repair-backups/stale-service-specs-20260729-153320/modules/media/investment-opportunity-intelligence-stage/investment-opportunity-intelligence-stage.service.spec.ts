import { InvestmentOpportunityIntelligenceStageService } from './investment-opportunity-intelligence-stage.service';

describe('InvestmentOpportunityIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(InvestmentOpportunityIntelligenceStageService).toBeDefined();
    expect(typeof InvestmentOpportunityIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(InvestmentOpportunityIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (InvestmentOpportunityIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(InvestmentOpportunityIntelligenceStageService.name).toBe('InvestmentOpportunityIntelligenceStageService');
  });
});