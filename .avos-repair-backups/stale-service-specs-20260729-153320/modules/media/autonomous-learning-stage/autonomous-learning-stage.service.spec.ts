import { AutonomousLearningStageService } from './autonomous-learning-stage.service';

describe('AutonomousLearningStageService', () => {
  it('should expose the current service class', () => {
    expect(AutonomousLearningStageService).toBeDefined();
    expect(typeof AutonomousLearningStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(AutonomousLearningStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (AutonomousLearningStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(AutonomousLearningStageService.name).toBe('AutonomousLearningStageService');
  });
});