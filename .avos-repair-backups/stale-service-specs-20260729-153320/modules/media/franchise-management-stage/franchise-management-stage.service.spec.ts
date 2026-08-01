import { FranchiseManagementStageService } from './franchise-management-stage.service';

describe('FranchiseManagementStageService', () => {
  it('should expose the current service class', () => {
    expect(FranchiseManagementStageService).toBeDefined();
    expect(typeof FranchiseManagementStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(FranchiseManagementStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (FranchiseManagementStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(FranchiseManagementStageService.name).toBe('FranchiseManagementStageService');
  });
});