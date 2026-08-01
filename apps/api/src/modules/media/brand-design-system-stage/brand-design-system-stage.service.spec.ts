import { BrandDesignSystemStageService } from './brand-design-system-stage.service';

describe('BrandDesignSystemStageService', () => {
  it('exports the current service class', () => {
    expect(BrandDesignSystemStageService).toBeDefined();
    expect(typeof BrandDesignSystemStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = BrandDesignSystemStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(BrandDesignSystemStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});