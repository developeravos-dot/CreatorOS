import { CharacterDevelopmentStageService } from './character-development-stage.service';

describe('CharacterDevelopmentStageService', () => {
  it('should expose the current service class', () => {
    expect(CharacterDevelopmentStageService).toBeDefined();
    expect(typeof CharacterDevelopmentStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(CharacterDevelopmentStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (CharacterDevelopmentStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(CharacterDevelopmentStageService.name).toBe('CharacterDevelopmentStageService');
  });
});