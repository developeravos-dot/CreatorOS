import { CulturalLocalizationStageService } from './cultural-localization-stage.service';

describe('CulturalLocalizationStageService', () => {
  it('should expose the current service class', () => {
    expect(CulturalLocalizationStageService).toBeDefined();
    expect(typeof CulturalLocalizationStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(CulturalLocalizationStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (CulturalLocalizationStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(CulturalLocalizationStageService.name).toBe('CulturalLocalizationStageService');
  });
});