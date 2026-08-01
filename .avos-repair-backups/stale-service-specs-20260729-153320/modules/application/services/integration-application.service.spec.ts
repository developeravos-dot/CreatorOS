import { IntegrationApplicationService } from './integration-application.service';

describe('IntegrationApplicationService', () => {
  it('should expose the current service class', () => {
    expect(IntegrationApplicationService).toBeDefined();
    expect(typeof IntegrationApplicationService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(IntegrationApplicationService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (IntegrationApplicationService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(IntegrationApplicationService.name).toBe('IntegrationApplicationService');
  });
});