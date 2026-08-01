import { ColorScienceStageService } from './color-science-stage.service';

describe('ColorScienceStageService', () => {
  it('should expose the current service class', () => {
    expect(ColorScienceStageService).toBeDefined();
    expect(typeof ColorScienceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ColorScienceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ColorScienceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ColorScienceStageService.name).toBe('ColorScienceStageService');
  });
});