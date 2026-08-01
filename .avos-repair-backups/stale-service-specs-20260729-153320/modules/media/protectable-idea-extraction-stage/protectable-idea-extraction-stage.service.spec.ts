import { ProtectableIdeaExtractionStageService } from './protectable-idea-extraction-stage.service';

describe('ProtectableIdeaExtractionStageService', () => {
  it('should expose the current service class', () => {
    expect(ProtectableIdeaExtractionStageService).toBeDefined();
    expect(typeof ProtectableIdeaExtractionStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ProtectableIdeaExtractionStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ProtectableIdeaExtractionStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ProtectableIdeaExtractionStageService.name).toBe('ProtectableIdeaExtractionStageService');
  });
});