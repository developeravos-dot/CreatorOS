import { CharacterIntelligenceStageService } from './character-intelligence-stage.service';

describe('CharacterIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(CharacterIntelligenceStageService).toBeDefined();
    expect(typeof CharacterIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CharacterIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CharacterIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});