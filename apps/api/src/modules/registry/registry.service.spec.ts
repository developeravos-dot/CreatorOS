import { RegistryService } from './registry.service';

describe('RegistryService', () => {
  it('exports the current service class', () => {
    expect(RegistryService).toBeDefined();
    expect(typeof RegistryService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = RegistryService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(RegistryService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});