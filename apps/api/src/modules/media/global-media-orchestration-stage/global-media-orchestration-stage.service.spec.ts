import { GlobalMediaOrchestrationStageService } from './global-media-orchestration-stage.service';

describe('GlobalMediaOrchestrationStageService', () => {
  it('exports the current service class', () => {
    expect(GlobalMediaOrchestrationStageService).toBeDefined();
    expect(typeof GlobalMediaOrchestrationStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = GlobalMediaOrchestrationStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(GlobalMediaOrchestrationStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});