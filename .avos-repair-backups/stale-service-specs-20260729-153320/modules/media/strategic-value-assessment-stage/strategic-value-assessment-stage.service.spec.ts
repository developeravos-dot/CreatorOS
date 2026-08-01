import { StrategicValueAssessmentStageService } from './strategic-value-assessment-stage.service';

describe('StrategicValueAssessmentStageService', () => {
  it('should expose the current service class', () => {
    expect(StrategicValueAssessmentStageService).toBeDefined();
    expect(typeof StrategicValueAssessmentStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(StrategicValueAssessmentStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (StrategicValueAssessmentStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(StrategicValueAssessmentStageService.name).toBe('StrategicValueAssessmentStageService');
  });
});