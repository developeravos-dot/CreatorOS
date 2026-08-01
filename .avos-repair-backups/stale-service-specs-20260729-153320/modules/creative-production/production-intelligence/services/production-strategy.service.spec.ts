import { ProductionStrategyService } from './production-strategy.service';

describe('ProductionStrategyService', () => {
  it('should expose the current service class', () => {
    expect(ProductionStrategyService).toBeDefined();
    expect(typeof ProductionStrategyService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ProductionStrategyService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ProductionStrategyService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ProductionStrategyService.name).toBe('ProductionStrategyService');
  });
});