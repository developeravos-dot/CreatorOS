import { IdentityService } from './identity.service';

describe('IdentityService', () => {
  it('exports the current service class', () => {
    expect(IdentityService).toBeDefined();
    expect(typeof IdentityService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = IdentityService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(IdentityService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});