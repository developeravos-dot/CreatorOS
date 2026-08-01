import { StoryFormatIntelligenceService } from './story-format-intelligence.service';

describe('StoryFormatIntelligenceService', () => {
  it('exports the current service class', () => {
    expect(StoryFormatIntelligenceService).toBeDefined();
    expect(typeof StoryFormatIntelligenceService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = StoryFormatIntelligenceService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(StoryFormatIntelligenceService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});