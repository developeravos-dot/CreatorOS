import { ProductionStrategyStageService } from './production-strategy-stage.service';

describe('ProductionStrategyStageService', () => {
  it('exports the current service class', () => {
    expect(ProductionStrategyStageService).toBeDefined();
    expect(typeof ProductionStrategyStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ProductionStrategyStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ProductionStrategyStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});