import { AuthService } from './auth.service';

describe('AuthService', () => {
  it('exports the current service class', () => {
    expect(AuthService).toBeDefined();
    expect(typeof AuthService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = AuthService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(AuthService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});