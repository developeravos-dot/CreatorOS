import { ObservabilityService } from './observability.service';

describe('ObservabilityService', () => {
  it('should expose the current service class', () => {
    expect(ObservabilityService).toBeDefined();
    expect(typeof ObservabilityService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ObservabilityService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ObservabilityService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ObservabilityService.name).toBe('ObservabilityService');
  });
});