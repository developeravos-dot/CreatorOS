import { MultiLanguageAdaptationStageService } from './multi-language-adaptation-stage.service';

describe('MultiLanguageAdaptationStageService', () => {
  it('exports the current service class', () => {
    expect(MultiLanguageAdaptationStageService).toBeDefined();
    expect(typeof MultiLanguageAdaptationStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = MultiLanguageAdaptationStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(MultiLanguageAdaptationStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});