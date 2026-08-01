import { MultiplatformAdaptationStageService } from './multiplatform-adaptation-stage.service';

describe('MultiplatformAdaptationStageService', () => {
  it('should expose the current service class', () => {
    expect(MultiplatformAdaptationStageService).toBeDefined();
    expect(typeof MultiplatformAdaptationStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(MultiplatformAdaptationStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (MultiplatformAdaptationStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(MultiplatformAdaptationStageService.name).toBe('MultiplatformAdaptationStageService');
  });
});