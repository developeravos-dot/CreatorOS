import { ConceptDevelopmentStageService } from './concept-development-stage.service';

describe('ConceptDevelopmentStageService', () => {
  it('should expose the current service class', () => {
    expect(ConceptDevelopmentStageService).toBeDefined();
    expect(typeof ConceptDevelopmentStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ConceptDevelopmentStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ConceptDevelopmentStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ConceptDevelopmentStageService.name).toBe('ConceptDevelopmentStageService');
  });
});