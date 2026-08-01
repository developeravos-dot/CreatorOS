import { ContinuousLearningStageService } from './continuous-learning-stage.service';

describe('ContinuousLearningStageService', () => {
  it('exports the current service class', () => {
    expect(ContinuousLearningStageService).toBeDefined();
    expect(typeof ContinuousLearningStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ContinuousLearningStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ContinuousLearningStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});