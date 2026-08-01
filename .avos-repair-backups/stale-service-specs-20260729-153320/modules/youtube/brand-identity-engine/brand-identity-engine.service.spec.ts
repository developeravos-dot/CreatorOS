import { BrandIdentityEngineService } from './brand-identity-engine.service';

describe('BrandIdentityEngineService', () => {
  it('should expose the current service class', () => {
    expect(BrandIdentityEngineService).toBeDefined();
    expect(typeof BrandIdentityEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(BrandIdentityEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (BrandIdentityEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(BrandIdentityEngineService.name).toBe('BrandIdentityEngineService');
  });
});