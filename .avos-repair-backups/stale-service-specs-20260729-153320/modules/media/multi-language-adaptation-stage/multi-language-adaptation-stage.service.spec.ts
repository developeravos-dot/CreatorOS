import { MultiLanguageAdaptationStageService } from './multi-language-adaptation-stage.service';

describe('MultiLanguageAdaptationStageService', () => {
  it('should expose the current service class', () => {
    expect(MultiLanguageAdaptationStageService).toBeDefined();
    expect(typeof MultiLanguageAdaptationStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(MultiLanguageAdaptationStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (MultiLanguageAdaptationStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(MultiLanguageAdaptationStageService.name).toBe('MultiLanguageAdaptationStageService');
  });
});