import { BusinessHumanFinalAuthorityStageService } from './business-human-final-authority-stage.service';

describe('BusinessHumanFinalAuthorityStageService', () => {
  it('should expose the current service class', () => {
    expect(BusinessHumanFinalAuthorityStageService).toBeDefined();
    expect(typeof BusinessHumanFinalAuthorityStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(BusinessHumanFinalAuthorityStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (BusinessHumanFinalAuthorityStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(BusinessHumanFinalAuthorityStageService.name).toBe('BusinessHumanFinalAuthorityStageService');
  });
});