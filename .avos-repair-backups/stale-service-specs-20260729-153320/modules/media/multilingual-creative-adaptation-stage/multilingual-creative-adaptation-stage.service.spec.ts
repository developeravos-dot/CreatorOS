import { MultilingualCreativeAdaptationStageService } from './multilingual-creative-adaptation-stage.service';

describe('MultilingualCreativeAdaptationStageService', () => {
  it('should expose the current service class', () => {
    expect(MultilingualCreativeAdaptationStageService).toBeDefined();
    expect(typeof MultilingualCreativeAdaptationStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(MultilingualCreativeAdaptationStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (MultilingualCreativeAdaptationStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(MultilingualCreativeAdaptationStageService.name).toBe('MultilingualCreativeAdaptationStageService');
  });
});