import { PortfolioOptimizationStageService } from './portfolio-optimization-stage.service';

describe('PortfolioOptimizationStageService', () => {
  it('exports the current service class', () => {
    expect(PortfolioOptimizationStageService).toBeDefined();
    expect(typeof PortfolioOptimizationStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = PortfolioOptimizationStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(PortfolioOptimizationStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});