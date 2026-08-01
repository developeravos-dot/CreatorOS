import { LicensingManagementStageService } from './licensing-management-stage.service';

describe('LicensingManagementStageService', () => {
  it('should expose the current service class', () => {
    expect(LicensingManagementStageService).toBeDefined();
    expect(typeof LicensingManagementStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(LicensingManagementStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (LicensingManagementStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(LicensingManagementStageService.name).toBe('LicensingManagementStageService');
  });
});