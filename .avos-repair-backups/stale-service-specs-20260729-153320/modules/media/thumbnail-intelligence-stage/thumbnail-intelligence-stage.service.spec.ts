import { ThumbnailIntelligenceStageService } from './thumbnail-intelligence-stage.service';

describe('ThumbnailIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(ThumbnailIntelligenceStageService).toBeDefined();
    expect(typeof ThumbnailIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ThumbnailIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ThumbnailIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ThumbnailIntelligenceStageService.name).toBe('ThumbnailIntelligenceStageService');
  });
});