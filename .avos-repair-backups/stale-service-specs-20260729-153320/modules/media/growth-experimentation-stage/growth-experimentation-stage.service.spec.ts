import { GrowthExperimentationStageService } from './growth-experimentation-stage.service';

describe('GrowthExperimentationStageService', () => {
  it('should expose the current service class', () => {
    expect(GrowthExperimentationStageService).toBeDefined();
    expect(typeof GrowthExperimentationStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(GrowthExperimentationStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (GrowthExperimentationStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(GrowthExperimentationStageService.name).toBe('GrowthExperimentationStageService');
  });
});