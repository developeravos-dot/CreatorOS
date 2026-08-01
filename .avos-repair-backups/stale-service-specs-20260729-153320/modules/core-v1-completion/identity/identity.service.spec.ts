import { IdentityService } from './identity.service';

describe('IdentityService', () => {
  it('should expose the current service class', () => {
    expect(IdentityService).toBeDefined();
    expect(typeof IdentityService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(IdentityService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (IdentityService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(IdentityService.name).toBe('IdentityService');
  });
});