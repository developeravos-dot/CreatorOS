import { BrandIdentityCreativeStudioService } from './brand-identity-creative-studio.service';

describe('BrandIdentityCreativeStudioService', () => {
  it('should expose the current service class', () => {
    expect(BrandIdentityCreativeStudioService).toBeDefined();
    expect(typeof BrandIdentityCreativeStudioService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(BrandIdentityCreativeStudioService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (BrandIdentityCreativeStudioService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(BrandIdentityCreativeStudioService.name).toBe('BrandIdentityCreativeStudioService');
  });
});