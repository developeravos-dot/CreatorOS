import { VisualEffectsStageService } from './visual-effects-stage.service';

describe('VisualEffectsStageService', () => {
  it('exports the current service class', () => {
    expect(VisualEffectsStageService).toBeDefined();
    expect(typeof VisualEffectsStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = VisualEffectsStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(VisualEffectsStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});