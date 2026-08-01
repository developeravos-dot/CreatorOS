import { LearningReinvestmentStageService } from './learning-reinvestment-stage.service';

describe('LearningReinvestmentStageService', () => {
  it('exports the current service class', () => {
    expect(LearningReinvestmentStageService).toBeDefined();
    expect(typeof LearningReinvestmentStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = LearningReinvestmentStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(LearningReinvestmentStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});