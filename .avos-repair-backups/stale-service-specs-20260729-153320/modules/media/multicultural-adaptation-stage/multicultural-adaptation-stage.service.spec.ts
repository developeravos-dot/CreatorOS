import { MulticulturalAdaptationStageService } from './multicultural-adaptation-stage.service';

describe('MulticulturalAdaptationStageService', () => {
  it('should expose the current service class', () => {
    expect(MulticulturalAdaptationStageService).toBeDefined();
    expect(typeof MulticulturalAdaptationStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(MulticulturalAdaptationStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (MulticulturalAdaptationStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(MulticulturalAdaptationStageService.name).toBe('MulticulturalAdaptationStageService');
  });
});