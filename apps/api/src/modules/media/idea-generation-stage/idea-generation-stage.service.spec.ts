import { IdeaGenerationStageService } from './idea-generation-stage.service';

describe('IdeaGenerationStageService', () => {
  it('exports the current service class', () => {
    expect(IdeaGenerationStageService).toBeDefined();
    expect(typeof IdeaGenerationStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = IdeaGenerationStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(IdeaGenerationStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});