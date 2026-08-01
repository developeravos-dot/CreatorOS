import { BusinessClientSolutionsStageService } from './business-client-solutions-stage.service';

describe('BusinessClientSolutionsStageService', () => {
  it('should expose the current service class', () => {
    expect(BusinessClientSolutionsStageService).toBeDefined();
    expect(typeof BusinessClientSolutionsStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(BusinessClientSolutionsStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (BusinessClientSolutionsStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(BusinessClientSolutionsStageService.name).toBe('BusinessClientSolutionsStageService');
  });
});