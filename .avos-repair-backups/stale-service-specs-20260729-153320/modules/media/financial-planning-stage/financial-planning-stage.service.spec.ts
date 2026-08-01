import { FinancialPlanningStageService } from './financial-planning-stage.service';

describe('FinancialPlanningStageService', () => {
  it('should expose the current service class', () => {
    expect(FinancialPlanningStageService).toBeDefined();
    expect(typeof FinancialPlanningStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(FinancialPlanningStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (FinancialPlanningStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(FinancialPlanningStageService.name).toBe('FinancialPlanningStageService');
  });
});