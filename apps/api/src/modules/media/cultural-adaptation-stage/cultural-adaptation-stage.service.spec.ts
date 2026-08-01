import { CulturalAdaptationStageService } from './cultural-adaptation-stage.service';

describe('CulturalAdaptationStageService', () => {
  it('exports the current service class', () => {
    expect(CulturalAdaptationStageService).toBeDefined();
    expect(typeof CulturalAdaptationStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CulturalAdaptationStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CulturalAdaptationStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});