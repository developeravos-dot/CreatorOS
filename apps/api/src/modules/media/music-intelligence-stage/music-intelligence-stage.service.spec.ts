import { MusicIntelligenceStageService } from './music-intelligence-stage.service';

describe('MusicIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(MusicIntelligenceStageService).toBeDefined();
    expect(typeof MusicIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = MusicIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(MusicIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});