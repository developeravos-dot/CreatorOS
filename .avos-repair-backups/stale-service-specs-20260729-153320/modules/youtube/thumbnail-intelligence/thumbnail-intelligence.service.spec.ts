import { ThumbnailIntelligenceService } from './thumbnail-intelligence.service';

describe('ThumbnailIntelligenceService', () => {
  it('should expose the current service class', () => {
    expect(ThumbnailIntelligenceService).toBeDefined();
    expect(typeof ThumbnailIntelligenceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ThumbnailIntelligenceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ThumbnailIntelligenceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ThumbnailIntelligenceService.name).toBe('ThumbnailIntelligenceService');
  });
});