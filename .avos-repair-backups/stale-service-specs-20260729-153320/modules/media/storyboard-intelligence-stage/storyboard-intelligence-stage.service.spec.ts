import { StoryboardIntelligenceStageService } from './storyboard-intelligence-stage.service';

describe('StoryboardIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(StoryboardIntelligenceStageService).toBeDefined();
    expect(typeof StoryboardIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(StoryboardIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (StoryboardIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(StoryboardIntelligenceStageService.name).toBe('StoryboardIntelligenceStageService');
  });
});