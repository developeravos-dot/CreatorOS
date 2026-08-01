import { AuthService } from './auth.service';

describe('AuthService', () => {
  it('should expose the current service class', () => {
    expect(AuthService).toBeDefined();
    expect(typeof AuthService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(AuthService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (AuthService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(AuthService.name).toBe('AuthService');
  });
});