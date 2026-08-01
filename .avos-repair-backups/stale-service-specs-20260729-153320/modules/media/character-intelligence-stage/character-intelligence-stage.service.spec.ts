import { CharacterIntelligenceStageService } from './character-intelligence-stage.service';

describe('CharacterIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(CharacterIntelligenceStageService).toBeDefined();
    expect(typeof CharacterIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(CharacterIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (CharacterIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(CharacterIntelligenceStageService.name).toBe('CharacterIntelligenceStageService');
  });
});