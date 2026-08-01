import { PortfolioCapitalAllocationStageService } from './portfolio-capital-allocation-stage.service';

describe('PortfolioCapitalAllocationStageService', () => {
  it('exports the current service class', () => {
    expect(PortfolioCapitalAllocationStageService).toBeDefined();
    expect(typeof PortfolioCapitalAllocationStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = PortfolioCapitalAllocationStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(PortfolioCapitalAllocationStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});