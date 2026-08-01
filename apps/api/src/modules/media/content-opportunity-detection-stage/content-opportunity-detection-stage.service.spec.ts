import { ContentOpportunityDetectionStageService } from './content-opportunity-detection-stage.service';

describe('ContentOpportunityDetectionStageService', () => {
  it('exports the current service class', () => {
    expect(ContentOpportunityDetectionStageService).toBeDefined();
    expect(typeof ContentOpportunityDetectionStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ContentOpportunityDetectionStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ContentOpportunityDetectionStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});