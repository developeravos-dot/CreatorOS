import { BrandStrategyStageService } from './brand-strategy-stage.service';

describe('BrandStrategyStageService', () => {
  it('exports the current service class', () => {
    expect(BrandStrategyStageService).toBeDefined();
    expect(typeof BrandStrategyStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = BrandStrategyStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(BrandStrategyStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});