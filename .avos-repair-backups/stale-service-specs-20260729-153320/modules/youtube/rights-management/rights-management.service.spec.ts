import { RightsManagementService } from './rights-management.service';

describe('RightsManagementService', () => {
  it('should expose the current service class', () => {
    expect(RightsManagementService).toBeDefined();
    expect(typeof RightsManagementService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(RightsManagementService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (RightsManagementService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(RightsManagementService.name).toBe('RightsManagementService');
  });
});