import { AutonomousLearningStageService } from './autonomous-learning-stage.service';

describe('AutonomousLearningStageService', () => {
  it('exports the current service class', () => {
    expect(AutonomousLearningStageService).toBeDefined();
    expect(typeof AutonomousLearningStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = AutonomousLearningStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(AutonomousLearningStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});