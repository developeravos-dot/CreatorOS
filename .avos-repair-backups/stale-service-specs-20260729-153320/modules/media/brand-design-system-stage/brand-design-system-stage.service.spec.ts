import { BrandDesignSystemStageService } from './brand-design-system-stage.service';

describe('BrandDesignSystemStageService', () => {
  it('should expose the current service class', () => {
    expect(BrandDesignSystemStageService).toBeDefined();
    expect(typeof BrandDesignSystemStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(BrandDesignSystemStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (BrandDesignSystemStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(BrandDesignSystemStageService.name).toBe('BrandDesignSystemStageService');
  });
});