import { PortfolioCapitalAllocationStageService } from './portfolio-capital-allocation-stage.service';

describe('PortfolioCapitalAllocationStageService', () => {
  it('should expose the current service class', () => {
    expect(PortfolioCapitalAllocationStageService).toBeDefined();
    expect(typeof PortfolioCapitalAllocationStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(PortfolioCapitalAllocationStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (PortfolioCapitalAllocationStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(PortfolioCapitalAllocationStageService.name).toBe('PortfolioCapitalAllocationStageService');
  });
});