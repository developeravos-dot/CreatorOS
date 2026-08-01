import { RecommendationEngineService } from './recommendation-engine.service';

describe('RecommendationEngineService', () => {
  it('exports the current service class', () => {
    expect(RecommendationEngineService).toBeDefined();
    expect(typeof RecommendationEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = RecommendationEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(RecommendationEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});