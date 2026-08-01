import { ConceptValidationStageService } from './concept-validation-stage.service';

describe('ConceptValidationStageService', () => {
  it('exports the current service class', () => {
    expect(ConceptValidationStageService).toBeDefined();
    expect(typeof ConceptValidationStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ConceptValidationStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ConceptValidationStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});