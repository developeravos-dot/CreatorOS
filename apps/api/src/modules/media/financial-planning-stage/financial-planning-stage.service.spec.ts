import { FinancialPlanningStageService } from './financial-planning-stage.service';

describe('FinancialPlanningStageService', () => {
  it('exports the current service class', () => {
    expect(FinancialPlanningStageService).toBeDefined();
    expect(typeof FinancialPlanningStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = FinancialPlanningStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(FinancialPlanningStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});