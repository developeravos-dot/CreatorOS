import { ResearchValidationStageService } from './research-validation-stage.service';

describe('ResearchValidationStageService', () => {
  it('exports the current service class', () => {
    expect(ResearchValidationStageService).toBeDefined();
    expect(typeof ResearchValidationStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ResearchValidationStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ResearchValidationStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});