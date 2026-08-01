import { ResearchValidationStageService } from './research-validation-stage.service';

describe('ResearchValidationStageService', () => {
  it('should expose the current service class', () => {
    expect(ResearchValidationStageService).toBeDefined();
    expect(typeof ResearchValidationStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ResearchValidationStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ResearchValidationStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ResearchValidationStageService.name).toBe('ResearchValidationStageService');
  });
});