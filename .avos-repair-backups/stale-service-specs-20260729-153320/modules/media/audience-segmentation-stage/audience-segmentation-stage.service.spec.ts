import { AudienceSegmentationStageService } from './audience-segmentation-stage.service';

describe('AudienceSegmentationStageService', () => {
  it('should expose the current service class', () => {
    expect(AudienceSegmentationStageService).toBeDefined();
    expect(typeof AudienceSegmentationStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(AudienceSegmentationStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (AudienceSegmentationStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(AudienceSegmentationStageService.name).toBe('AudienceSegmentationStageService');
  });
});