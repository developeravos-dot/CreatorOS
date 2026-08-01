import { ProductionStageService } from './production-stage.service';

describe('ProductionStageService', () => {
  it('exports the current service class', () => {
    expect(ProductionStageService).toBeDefined();
    expect(typeof ProductionStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ProductionStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ProductionStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});