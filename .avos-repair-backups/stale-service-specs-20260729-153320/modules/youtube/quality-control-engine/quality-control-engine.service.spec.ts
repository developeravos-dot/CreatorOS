import { QualityControlEngineService } from './quality-control-engine.service';

describe('QualityControlEngineService', () => {
  it('should expose the current service class', () => {
    expect(QualityControlEngineService).toBeDefined();
    expect(typeof QualityControlEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(QualityControlEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (QualityControlEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(QualityControlEngineService.name).toBe('QualityControlEngineService');
  });
});