import { CreativeExperimentationStageService } from './creative-experimentation-stage.service';

describe('CreativeExperimentationStageService', () => {
  it('should expose the current service class', () => {
    expect(CreativeExperimentationStageService).toBeDefined();
    expect(typeof CreativeExperimentationStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(CreativeExperimentationStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (CreativeExperimentationStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(CreativeExperimentationStageService.name).toBe('CreativeExperimentationStageService');
  });
});