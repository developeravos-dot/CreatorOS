import { FinancialValuationStageService } from './financial-valuation-stage.service';

describe('FinancialValuationStageService', () => {
  it('should expose the current service class', () => {
    expect(FinancialValuationStageService).toBeDefined();
    expect(typeof FinancialValuationStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(FinancialValuationStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (FinancialValuationStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(FinancialValuationStageService.name).toBe('FinancialValuationStageService');
  });
});