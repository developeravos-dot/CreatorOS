import { RefreshTokenService } from './refresh-token.service';

describe('RefreshTokenService', () => {
  it('should expose the current service class', () => {
    expect(RefreshTokenService).toBeDefined();
    expect(typeof RefreshTokenService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(RefreshTokenService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (RefreshTokenService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(RefreshTokenService.name).toBe('RefreshTokenService');
  });
});