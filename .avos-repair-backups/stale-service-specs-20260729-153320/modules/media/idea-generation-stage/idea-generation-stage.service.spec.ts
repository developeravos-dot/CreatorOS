import { IdeaGenerationStageService } from './idea-generation-stage.service';

describe('IdeaGenerationStageService', () => {
  it('should expose the current service class', () => {
    expect(IdeaGenerationStageService).toBeDefined();
    expect(typeof IdeaGenerationStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(IdeaGenerationStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (IdeaGenerationStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(IdeaGenerationStageService.name).toBe('IdeaGenerationStageService');
  });
});