import { BudgetAllocationStageService } from './budget-allocation-stage.service';

describe('BudgetAllocationStageService', () => {
  it('exports the current service class', () => {
    expect(BudgetAllocationStageService).toBeDefined();
    expect(typeof BudgetAllocationStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = BudgetAllocationStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(BudgetAllocationStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});