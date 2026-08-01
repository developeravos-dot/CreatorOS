import { InvestmentOpportunityIntelligenceStageService } from './investment-opportunity-intelligence-stage.service';

describe('InvestmentOpportunityIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(InvestmentOpportunityIntelligenceStageService).toBeDefined();
    expect(typeof InvestmentOpportunityIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = InvestmentOpportunityIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(InvestmentOpportunityIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});