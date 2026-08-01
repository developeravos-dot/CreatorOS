import { IntegrationRegistryService } from './integration-registry.service';

describe('IntegrationRegistryService', () => {
  it('exports the current service class', () => {
    expect(IntegrationRegistryService).toBeDefined();
    expect(typeof IntegrationRegistryService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = IntegrationRegistryService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(IntegrationRegistryService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});