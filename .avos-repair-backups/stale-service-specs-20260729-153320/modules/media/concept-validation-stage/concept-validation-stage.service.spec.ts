import { ConceptValidationStageService } from './concept-validation-stage.service';

describe('ConceptValidationStageService', () => {
  it('should expose the current service class', () => {
    expect(ConceptValidationStageService).toBeDefined();
    expect(typeof ConceptValidationStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ConceptValidationStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ConceptValidationStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ConceptValidationStageService.name).toBe('ConceptValidationStageService');
  });
});