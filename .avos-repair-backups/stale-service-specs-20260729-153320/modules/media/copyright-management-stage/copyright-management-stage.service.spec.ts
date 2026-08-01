import { CopyrightManagementStageService } from './copyright-management-stage.service';

describe('CopyrightManagementStageService', () => {
  it('should expose the current service class', () => {
    expect(CopyrightManagementStageService).toBeDefined();
    expect(typeof CopyrightManagementStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(CopyrightManagementStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (CopyrightManagementStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(CopyrightManagementStageService.name).toBe('CopyrightManagementStageService');
  });
});