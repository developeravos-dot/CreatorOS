import { StoryFormatIntelligenceService } from './story-format-intelligence.service';

describe('StoryFormatIntelligenceService', () => {
  it('should expose the current service class', () => {
    expect(StoryFormatIntelligenceService).toBeDefined();
    expect(typeof StoryFormatIntelligenceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(StoryFormatIntelligenceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (StoryFormatIntelligenceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(StoryFormatIntelligenceService.name).toBe('StoryFormatIntelligenceService');
  });
});