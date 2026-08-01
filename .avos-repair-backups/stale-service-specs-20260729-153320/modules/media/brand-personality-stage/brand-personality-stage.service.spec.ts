import { BrandPersonalityStageService } from './brand-personality-stage.service';

describe('BrandPersonalityStageService', () => {
  it('should expose the current service class', () => {
    expect(BrandPersonalityStageService).toBeDefined();
    expect(typeof BrandPersonalityStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(BrandPersonalityStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (BrandPersonalityStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(BrandPersonalityStageService.name).toBe('BrandPersonalityStageService');
  });
});