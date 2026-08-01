import { ProductionStrategyStageService } from './production-strategy-stage.service';

describe('ProductionStrategyStageService', () => {
  it('should expose the current service class', () => {
    expect(ProductionStrategyStageService).toBeDefined();
    expect(typeof ProductionStrategyStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ProductionStrategyStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ProductionStrategyStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ProductionStrategyStageService.name).toBe('ProductionStrategyStageService');
  });
});