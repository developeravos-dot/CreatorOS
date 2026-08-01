import { DigitalProductsEngineService } from './digital-products-engine.service';

describe('DigitalProductsEngineService', () => {
  it('exports the current service class', () => {
    expect(DigitalProductsEngineService).toBeDefined();
    expect(typeof DigitalProductsEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = DigitalProductsEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(DigitalProductsEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});