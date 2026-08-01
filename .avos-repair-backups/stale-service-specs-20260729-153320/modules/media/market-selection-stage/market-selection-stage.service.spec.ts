import { MarketSelectionStageService } from './market-selection-stage.service';

describe('MarketSelectionStageService', () => {
  it('should expose the current service class', () => {
    expect(MarketSelectionStageService).toBeDefined();
    expect(typeof MarketSelectionStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(MarketSelectionStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (MarketSelectionStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(MarketSelectionStageService.name).toBe('MarketSelectionStageService');
  });
});