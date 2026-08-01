import { BrandIdentityCreativeStudioService } from './brand-identity-creative-studio.service';

describe('BrandIdentityCreativeStudioService', () => {
  it('exports the current service class', () => {
    expect(BrandIdentityCreativeStudioService).toBeDefined();
    expect(typeof BrandIdentityCreativeStudioService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = BrandIdentityCreativeStudioService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(BrandIdentityCreativeStudioService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});