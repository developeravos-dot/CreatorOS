import { IntegrationsService } from './integrations.service';

describe('IntegrationsService', () => {
  it('should expose the current service class', () => {
    expect(IntegrationsService).toBeDefined();
    expect(typeof IntegrationsService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(IntegrationsService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (IntegrationsService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(IntegrationsService.name).toBe('IntegrationsService');
  });
});