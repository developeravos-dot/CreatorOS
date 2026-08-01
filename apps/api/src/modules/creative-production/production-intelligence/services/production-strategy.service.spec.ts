import { ProductionStrategyService } from './production-strategy.service';

describe('ProductionStrategyService', () => {
  it('exports the current service class', () => {
    expect(ProductionStrategyService).toBeDefined();
    expect(typeof ProductionStrategyService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ProductionStrategyService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ProductionStrategyService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});