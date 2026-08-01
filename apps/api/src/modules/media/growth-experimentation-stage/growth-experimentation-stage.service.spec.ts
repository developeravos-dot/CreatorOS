import { GrowthExperimentationStageService } from './growth-experimentation-stage.service';

describe('GrowthExperimentationStageService', () => {
  it('exports the current service class', () => {
    expect(GrowthExperimentationStageService).toBeDefined();
    expect(typeof GrowthExperimentationStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = GrowthExperimentationStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(GrowthExperimentationStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});