import { CulturalAdaptationStageService } from './cultural-adaptation-stage.service';

describe('CulturalAdaptationStageService', () => {
  it('should expose the current service class', () => {
    expect(CulturalAdaptationStageService).toBeDefined();
    expect(typeof CulturalAdaptationStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(CulturalAdaptationStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (CulturalAdaptationStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(CulturalAdaptationStageService.name).toBe('CulturalAdaptationStageService');
  });
});