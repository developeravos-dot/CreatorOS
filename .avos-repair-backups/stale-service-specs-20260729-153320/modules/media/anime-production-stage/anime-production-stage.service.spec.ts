import { AnimeProductionStageService } from './anime-production-stage.service';

describe('AnimeProductionStageService', () => {
  it('should expose the current service class', () => {
    expect(AnimeProductionStageService).toBeDefined();
    expect(typeof AnimeProductionStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(AnimeProductionStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (AnimeProductionStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(AnimeProductionStageService.name).toBe('AnimeProductionStageService');
  });
});