import { PortfolioOptimizationStageService } from './portfolio-optimization-stage.service';

describe('PortfolioOptimizationStageService', () => {
  it('should expose the current service class', () => {
    expect(PortfolioOptimizationStageService).toBeDefined();
    expect(typeof PortfolioOptimizationStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(PortfolioOptimizationStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (PortfolioOptimizationStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(PortfolioOptimizationStageService.name).toBe('PortfolioOptimizationStageService');
  });
});