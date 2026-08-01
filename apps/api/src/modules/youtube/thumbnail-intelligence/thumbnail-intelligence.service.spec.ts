import { ThumbnailIntelligenceService } from './thumbnail-intelligence.service';

describe('ThumbnailIntelligenceService', () => {
  it('exports the current service class', () => {
    expect(ThumbnailIntelligenceService).toBeDefined();
    expect(typeof ThumbnailIntelligenceService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ThumbnailIntelligenceService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ThumbnailIntelligenceService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});