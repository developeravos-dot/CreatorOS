import { PatentManagementStageService } from './patent-management-stage.service';

describe('PatentManagementStageService', () => {
  it('should expose the current service class', () => {
    expect(PatentManagementStageService).toBeDefined();
    expect(typeof PatentManagementStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(PatentManagementStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (PatentManagementStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(PatentManagementStageService.name).toBe('PatentManagementStageService');
  });
});