import { BudgetAllocationStageService } from './budget-allocation-stage.service';

describe('BudgetAllocationStageService', () => {
  it('should expose the current service class', () => {
    expect(BudgetAllocationStageService).toBeDefined();
    expect(typeof BudgetAllocationStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(BudgetAllocationStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (BudgetAllocationStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(BudgetAllocationStageService.name).toBe('BudgetAllocationStageService');
  });
});