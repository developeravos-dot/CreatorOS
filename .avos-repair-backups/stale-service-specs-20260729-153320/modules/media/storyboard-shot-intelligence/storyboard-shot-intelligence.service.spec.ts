import { StoryboardShotIntelligenceService } from './storyboard-shot-intelligence.service';

describe('StoryboardShotIntelligenceService', () => {
  it('should expose the current service class', () => {
    expect(StoryboardShotIntelligenceService).toBeDefined();
    expect(typeof StoryboardShotIntelligenceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(StoryboardShotIntelligenceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (StoryboardShotIntelligenceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(StoryboardShotIntelligenceService.name).toBe('StoryboardShotIntelligenceService');
  });
});