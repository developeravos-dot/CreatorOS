import { DigitalProductBusinessEngineService } from './digital-product-business-engine.service';

describe('DigitalProductBusinessEngineService', () => {
  it('exports the current service class', () => {
    expect(DigitalProductBusinessEngineService).toBeDefined();
    expect(typeof DigitalProductBusinessEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = DigitalProductBusinessEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(DigitalProductBusinessEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});