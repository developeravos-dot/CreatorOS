import { RoyaltyAccountingStageService } from './royalty-accounting-stage.service';

describe('RoyaltyAccountingStageService', () => {
  it('should expose the current service class', () => {
    expect(RoyaltyAccountingStageService).toBeDefined();
    expect(typeof RoyaltyAccountingStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(RoyaltyAccountingStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (RoyaltyAccountingStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(RoyaltyAccountingStageService.name).toBe('RoyaltyAccountingStageService');
  });
});