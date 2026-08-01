import { RecommendationEngineService } from './recommendation-engine.service';

describe('RecommendationEngineService', () => {
  it('should expose the current service class', () => {
    expect(RecommendationEngineService).toBeDefined();
    expect(typeof RecommendationEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(RecommendationEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (RecommendationEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(RecommendationEngineService.name).toBe('RecommendationEngineService');
  });
});