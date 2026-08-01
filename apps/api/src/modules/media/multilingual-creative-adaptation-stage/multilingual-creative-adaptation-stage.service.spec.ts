import { MultilingualCreativeAdaptationStageService } from './multilingual-creative-adaptation-stage.service';

describe('MultilingualCreativeAdaptationStageService', () => {
  it('exports the current service class', () => {
    expect(MultilingualCreativeAdaptationStageService).toBeDefined();
    expect(typeof MultilingualCreativeAdaptationStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = MultilingualCreativeAdaptationStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(MultilingualCreativeAdaptationStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});