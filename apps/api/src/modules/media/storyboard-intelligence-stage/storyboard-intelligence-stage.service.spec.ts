import { StoryboardIntelligenceStageService } from './storyboard-intelligence-stage.service';

describe('StoryboardIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(StoryboardIntelligenceStageService).toBeDefined();
    expect(typeof StoryboardIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = StoryboardIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(StoryboardIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});