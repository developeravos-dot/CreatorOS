import { HumanFinalAuthorityStageService } from './human-final-authority-stage.service';

describe('HumanFinalAuthorityStageService', () => {
  it('should expose the current service class', () => {
    expect(HumanFinalAuthorityStageService).toBeDefined();
    expect(typeof HumanFinalAuthorityStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(HumanFinalAuthorityStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (HumanFinalAuthorityStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(HumanFinalAuthorityStageService.name).toBe('HumanFinalAuthorityStageService');
  });
});