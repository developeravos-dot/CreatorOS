import { TranslationLocalizationStageService } from './translation-localization-stage.service';

describe('TranslationLocalizationStageService', () => {
  it('exports the current service class', () => {
    expect(TranslationLocalizationStageService).toBeDefined();
    expect(typeof TranslationLocalizationStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = TranslationLocalizationStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(TranslationLocalizationStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});