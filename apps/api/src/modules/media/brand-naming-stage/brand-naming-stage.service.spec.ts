import { BrandNamingStageService } from './brand-naming-stage.service';

describe('BrandNamingStageService', () => {
  it('exports the current service class', () => {
    expect(BrandNamingStageService).toBeDefined();
    expect(typeof BrandNamingStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = BrandNamingStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(BrandNamingStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});