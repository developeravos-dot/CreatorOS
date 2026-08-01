import { DigitalProductsEngineService } from './digital-products-engine.service';

describe('DigitalProductsEngineService', () => {
  it('should expose the current service class', () => {
    expect(DigitalProductsEngineService).toBeDefined();
    expect(typeof DigitalProductsEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(DigitalProductsEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (DigitalProductsEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(DigitalProductsEngineService.name).toBe('DigitalProductsEngineService');
  });
});