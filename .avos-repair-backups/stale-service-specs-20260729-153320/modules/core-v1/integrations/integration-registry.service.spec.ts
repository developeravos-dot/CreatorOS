import { IntegrationRegistryService } from './integration-registry.service';

describe('IntegrationRegistryService', () => {
  it('should expose the current service class', () => {
    expect(IntegrationRegistryService).toBeDefined();
    expect(typeof IntegrationRegistryService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(IntegrationRegistryService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (IntegrationRegistryService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(IntegrationRegistryService.name).toBe('IntegrationRegistryService');
  });
});