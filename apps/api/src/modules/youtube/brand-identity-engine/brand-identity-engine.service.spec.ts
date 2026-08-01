import { BrandIdentityEngineService } from './brand-identity-engine.service';

describe('BrandIdentityEngineService', () => {
  it('exports the current service class', () => {
    expect(BrandIdentityEngineService).toBeDefined();
    expect(typeof BrandIdentityEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = BrandIdentityEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(BrandIdentityEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});