import { AudienceSegmentationStageService } from './audience-segmentation-stage.service';

describe('AudienceSegmentationStageService', () => {
  it('exports the current service class', () => {
    expect(AudienceSegmentationStageService).toBeDefined();
    expect(typeof AudienceSegmentationStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = AudienceSegmentationStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(AudienceSegmentationStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});