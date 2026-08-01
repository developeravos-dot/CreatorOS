import { AnimeProductionStageService } from './anime-production-stage.service';

describe('AnimeProductionStageService', () => {
  it('exports the current service class', () => {
    expect(AnimeProductionStageService).toBeDefined();
    expect(typeof AnimeProductionStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = AnimeProductionStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(AnimeProductionStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});