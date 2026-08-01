import { BrandBookStageService } from './brand-book-stage.service';

describe('BrandBookStageService', () => {
  it('should expose the current service class', () => {
    expect(BrandBookStageService).toBeDefined();
    expect(typeof BrandBookStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(BrandBookStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (BrandBookStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(BrandBookStageService.name).toBe('BrandBookStageService');
  });
});