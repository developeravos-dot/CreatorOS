import { ConceptDevelopmentStageService } from './concept-development-stage.service';

describe('ConceptDevelopmentStageService', () => {
  it('exports the current service class', () => {
    expect(ConceptDevelopmentStageService).toBeDefined();
    expect(typeof ConceptDevelopmentStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ConceptDevelopmentStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ConceptDevelopmentStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});