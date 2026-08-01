import { StoryWorldBuildingStageService } from './story-world-building-stage.service';

describe('StoryWorldBuildingStageService', () => {
  it('should expose the current service class', () => {
    expect(StoryWorldBuildingStageService).toBeDefined();
    expect(typeof StoryWorldBuildingStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(StoryWorldBuildingStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (StoryWorldBuildingStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(StoryWorldBuildingStageService.name).toBe('StoryWorldBuildingStageService');
  });
});