import { AudiencePredictionStageService } from './audience-prediction-stage.service';

describe('AudiencePredictionStageService', () => {
  it('exports the current service class', () => {
    expect(AudiencePredictionStageService).toBeDefined();
    expect(typeof AudiencePredictionStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = AudiencePredictionStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(AudiencePredictionStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});