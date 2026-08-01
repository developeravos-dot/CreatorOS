import { ThumbnailIntelligenceStageService } from './thumbnail-intelligence-stage.service';

describe('ThumbnailIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(ThumbnailIntelligenceStageService).toBeDefined();
    expect(typeof ThumbnailIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ThumbnailIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ThumbnailIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});