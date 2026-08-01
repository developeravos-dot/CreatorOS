import { ProductionStageService } from './production-stage.service';

describe('ProductionStageService', () => {
  it('should expose the current service class', () => {
    expect(ProductionStageService).toBeDefined();
    expect(typeof ProductionStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ProductionStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ProductionStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ProductionStageService.name).toBe('ProductionStageService');
  });
});