import { ColorScienceStageService } from './color-science-stage.service';

describe('ColorScienceStageService', () => {
  it('exports the current service class', () => {
    expect(ColorScienceStageService).toBeDefined();
    expect(typeof ColorScienceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ColorScienceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ColorScienceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});