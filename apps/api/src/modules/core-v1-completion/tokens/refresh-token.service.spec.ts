import { RefreshTokenService } from './refresh-token.service';

describe('RefreshTokenService', () => {
  it('exports the current service class', () => {
    expect(RefreshTokenService).toBeDefined();
    expect(typeof RefreshTokenService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = RefreshTokenService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(RefreshTokenService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});