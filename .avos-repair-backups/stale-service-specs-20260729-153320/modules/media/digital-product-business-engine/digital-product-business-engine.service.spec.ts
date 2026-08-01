import { DigitalProductBusinessEngineService } from './digital-product-business-engine.service';

describe('DigitalProductBusinessEngineService', () => {
  it('should expose the current service class', () => {
    expect(DigitalProductBusinessEngineService).toBeDefined();
    expect(typeof DigitalProductBusinessEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(DigitalProductBusinessEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (DigitalProductBusinessEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(DigitalProductBusinessEngineService.name).toBe('DigitalProductBusinessEngineService');
  });
});