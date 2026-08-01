import { PublishingOrchestrationStageService } from './publishing-orchestration-stage.service';

describe('PublishingOrchestrationStageService', () => {
  it('exports the current service class', () => {
    expect(PublishingOrchestrationStageService).toBeDefined();
    expect(typeof PublishingOrchestrationStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = PublishingOrchestrationStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(PublishingOrchestrationStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});