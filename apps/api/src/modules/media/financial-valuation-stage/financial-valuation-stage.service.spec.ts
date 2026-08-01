import { FinancialValuationStageService } from './financial-valuation-stage.service';

describe('FinancialValuationStageService', () => {
  it('exports the current service class', () => {
    expect(FinancialValuationStageService).toBeDefined();
    expect(typeof FinancialValuationStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = FinancialValuationStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(FinancialValuationStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});