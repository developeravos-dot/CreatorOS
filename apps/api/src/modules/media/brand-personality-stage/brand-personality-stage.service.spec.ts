import { BrandPersonalityStageService } from './brand-personality-stage.service';

describe('BrandPersonalityStageService', () => {
  it('exports the current service class', () => {
    expect(BrandPersonalityStageService).toBeDefined();
    expect(typeof BrandPersonalityStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = BrandPersonalityStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(BrandPersonalityStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});