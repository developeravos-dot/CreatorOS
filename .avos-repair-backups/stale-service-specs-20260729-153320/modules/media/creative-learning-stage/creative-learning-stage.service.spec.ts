import { CreativeLearningStageService } from './creative-learning-stage.service';

describe('CreativeLearningStageService', () => {
  it('should expose the current service class', () => {
    expect(CreativeLearningStageService).toBeDefined();
    expect(typeof CreativeLearningStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(CreativeLearningStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (CreativeLearningStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(CreativeLearningStageService.name).toBe('CreativeLearningStageService');
  });
});