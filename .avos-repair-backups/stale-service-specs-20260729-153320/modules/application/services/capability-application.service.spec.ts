import { CapabilityApplicationService } from './capability-application.service';

describe('CapabilityApplicationService', () => {
  it('should expose the current service class', () => {
    expect(CapabilityApplicationService).toBeDefined();
    expect(typeof CapabilityApplicationService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(CapabilityApplicationService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (CapabilityApplicationService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(CapabilityApplicationService.name).toBe('CapabilityApplicationService');
  });
});