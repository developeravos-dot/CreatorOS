import { FranchiseRevenueIntelligenceStageService } from './franchise-revenue-intelligence-stage.service';

describe('FranchiseRevenueIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(FranchiseRevenueIntelligenceStageService).toBeDefined();
    expect(typeof FranchiseRevenueIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(FranchiseRevenueIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (FranchiseRevenueIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(FranchiseRevenueIntelligenceStageService.name).toBe('FranchiseRevenueIntelligenceStageService');
  });
});