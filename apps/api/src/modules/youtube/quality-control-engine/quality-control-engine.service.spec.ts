import { QualityControlEngineService } from './quality-control-engine.service';

describe('QualityControlEngineService', () => {
  it('exports the current service class', () => {
    expect(QualityControlEngineService).toBeDefined();
    expect(typeof QualityControlEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = QualityControlEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(QualityControlEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});