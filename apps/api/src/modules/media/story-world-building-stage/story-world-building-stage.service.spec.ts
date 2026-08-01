import { StoryWorldBuildingStageService } from './story-world-building-stage.service';

describe('StoryWorldBuildingStageService', () => {
  it('exports the current service class', () => {
    expect(StoryWorldBuildingStageService).toBeDefined();
    expect(typeof StoryWorldBuildingStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = StoryWorldBuildingStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(StoryWorldBuildingStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});