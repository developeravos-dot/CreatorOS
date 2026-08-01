import { StoryboardShotIntelligenceService } from './storyboard-shot-intelligence.service';

describe('StoryboardShotIntelligenceService', () => {
  it('exports the current service class', () => {
    expect(StoryboardShotIntelligenceService).toBeDefined();
    expect(typeof StoryboardShotIntelligenceService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = StoryboardShotIntelligenceService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(StoryboardShotIntelligenceService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});