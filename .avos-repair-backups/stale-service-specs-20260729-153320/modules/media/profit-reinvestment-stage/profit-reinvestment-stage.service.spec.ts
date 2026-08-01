import { ProfitReinvestmentStageService } from './profit-reinvestment-stage.service';

describe('ProfitReinvestmentStageService', () => {
  it('should expose the current service class', () => {
    expect(ProfitReinvestmentStageService).toBeDefined();
    expect(typeof ProfitReinvestmentStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ProfitReinvestmentStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ProfitReinvestmentStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ProfitReinvestmentStageService.name).toBe('ProfitReinvestmentStageService');
  });
});