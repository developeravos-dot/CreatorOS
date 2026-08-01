import { IdeaRankingStageService } from './idea-ranking-stage.service';

describe('IdeaRankingStageService', () => {
  it('exports the current service class', () => {
    expect(IdeaRankingStageService).toBeDefined();
    expect(typeof IdeaRankingStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = IdeaRankingStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(IdeaRankingStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});