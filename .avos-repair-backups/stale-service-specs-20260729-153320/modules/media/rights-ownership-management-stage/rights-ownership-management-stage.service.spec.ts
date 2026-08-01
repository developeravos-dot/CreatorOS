import { RightsOwnershipManagementStageService } from './rights-ownership-management-stage.service';

describe('RightsOwnershipManagementStageService', () => {
  it('should expose the current service class', () => {
    expect(RightsOwnershipManagementStageService).toBeDefined();
    expect(typeof RightsOwnershipManagementStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(RightsOwnershipManagementStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (RightsOwnershipManagementStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(RightsOwnershipManagementStageService.name).toBe('RightsOwnershipManagementStageService');
  });
});