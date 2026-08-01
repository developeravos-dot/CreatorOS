import { CreativeLearningStageService } from './creative-learning-stage.service';

describe('CreativeLearningStageService', () => {
  it('exports the current service class', () => {
    expect(CreativeLearningStageService).toBeDefined();
    expect(typeof CreativeLearningStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CreativeLearningStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CreativeLearningStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});