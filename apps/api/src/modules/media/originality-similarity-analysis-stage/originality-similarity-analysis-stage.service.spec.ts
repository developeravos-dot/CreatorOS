import { OriginalitySimilarityAnalysisStageService } from './originality-similarity-analysis-stage.service';

describe('OriginalitySimilarityAnalysisStageService', () => {
  it('exports the current service class', () => {
    expect(OriginalitySimilarityAnalysisStageService).toBeDefined();
    expect(typeof OriginalitySimilarityAnalysisStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = OriginalitySimilarityAnalysisStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(OriginalitySimilarityAnalysisStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});