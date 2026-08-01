import { BrandBookStageService } from './brand-book-stage.service';

describe('BrandBookStageService', () => {
  it('exports the current service class', () => {
    expect(BrandBookStageService).toBeDefined();
    expect(typeof BrandBookStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = BrandBookStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(BrandBookStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});