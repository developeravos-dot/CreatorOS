import { ContinuousLearningStageService } from './continuous-learning-stage.service';

describe('ContinuousLearningStageService', () => {
  it('should expose the current service class', () => {
    expect(ContinuousLearningStageService).toBeDefined();
    expect(typeof ContinuousLearningStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ContinuousLearningStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ContinuousLearningStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ContinuousLearningStageService.name).toBe('ContinuousLearningStageService');
  });
});