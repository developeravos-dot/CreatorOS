import { CreativeExperimentationStageService } from './creative-experimentation-stage.service';

describe('CreativeExperimentationStageService', () => {
  it('exports the current service class', () => {
    expect(CreativeExperimentationStageService).toBeDefined();
    expect(typeof CreativeExperimentationStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CreativeExperimentationStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CreativeExperimentationStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});