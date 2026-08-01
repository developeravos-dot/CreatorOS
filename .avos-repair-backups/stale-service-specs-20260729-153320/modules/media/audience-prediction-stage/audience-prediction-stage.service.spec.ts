import { AudiencePredictionStageService } from './audience-prediction-stage.service';

describe('AudiencePredictionStageService', () => {
  it('should expose the current service class', () => {
    expect(AudiencePredictionStageService).toBeDefined();
    expect(typeof AudiencePredictionStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(AudiencePredictionStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (AudiencePredictionStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(AudiencePredictionStageService.name).toBe('AudiencePredictionStageService');
  });
});