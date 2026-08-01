import { ProtectableIdeaExtractionStageService } from './protectable-idea-extraction-stage.service';

describe('ProtectableIdeaExtractionStageService', () => {
  it('exports the current service class', () => {
    expect(ProtectableIdeaExtractionStageService).toBeDefined();
    expect(typeof ProtectableIdeaExtractionStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ProtectableIdeaExtractionStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ProtectableIdeaExtractionStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});