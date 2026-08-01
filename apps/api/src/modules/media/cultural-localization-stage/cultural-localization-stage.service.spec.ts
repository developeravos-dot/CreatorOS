import { CulturalLocalizationStageService } from './cultural-localization-stage.service';

describe('CulturalLocalizationStageService', () => {
  it('exports the current service class', () => {
    expect(CulturalLocalizationStageService).toBeDefined();
    expect(typeof CulturalLocalizationStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CulturalLocalizationStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CulturalLocalizationStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});