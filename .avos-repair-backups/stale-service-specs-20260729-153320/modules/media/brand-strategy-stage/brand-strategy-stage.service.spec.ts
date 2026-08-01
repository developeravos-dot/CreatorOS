import { BrandStrategyStageService } from './brand-strategy-stage.service';

describe('BrandStrategyStageService', () => {
  it('should expose the current service class', () => {
    expect(BrandStrategyStageService).toBeDefined();
    expect(typeof BrandStrategyStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(BrandStrategyStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (BrandStrategyStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(BrandStrategyStageService.name).toBe('BrandStrategyStageService');
  });
});