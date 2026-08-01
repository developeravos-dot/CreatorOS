import { IdeaRankingStageService } from './idea-ranking-stage.service';

describe('IdeaRankingStageService', () => {
  it('should expose the current service class', () => {
    expect(IdeaRankingStageService).toBeDefined();
    expect(typeof IdeaRankingStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(IdeaRankingStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (IdeaRankingStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(IdeaRankingStageService.name).toBe('IdeaRankingStageService');
  });
});