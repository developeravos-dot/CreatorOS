import { CharacterDevelopmentStageService } from './character-development-stage.service';

describe('CharacterDevelopmentStageService', () => {
  it('exports the current service class', () => {
    expect(CharacterDevelopmentStageService).toBeDefined();
    expect(typeof CharacterDevelopmentStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CharacterDevelopmentStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CharacterDevelopmentStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});