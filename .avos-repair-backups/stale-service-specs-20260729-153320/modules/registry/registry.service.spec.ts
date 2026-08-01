import { RegistryService } from './registry.service';

describe('RegistryService', () => {
  it('should expose the current service class', () => {
    expect(RegistryService).toBeDefined();
    expect(typeof RegistryService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(RegistryService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (RegistryService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(RegistryService.name).toBe('RegistryService');
  });
});