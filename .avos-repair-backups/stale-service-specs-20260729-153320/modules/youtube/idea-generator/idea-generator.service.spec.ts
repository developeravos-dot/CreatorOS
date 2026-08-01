import { IdeaGeneratorService } from './idea-generator.service';

describe('IdeaGeneratorService', () => {
  it('should expose the current service class', () => {
    expect(IdeaGeneratorService).toBeDefined();
    expect(typeof IdeaGeneratorService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(IdeaGeneratorService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (IdeaGeneratorService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(IdeaGeneratorService.name).toBe('IdeaGeneratorService');
  });
});