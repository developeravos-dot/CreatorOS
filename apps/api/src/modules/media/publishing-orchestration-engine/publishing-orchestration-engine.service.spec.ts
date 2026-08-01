import { PublishingOrchestrationEngineService } from './publishing-orchestration-engine.service';

describe('PublishingOrchestrationEngineService', () => {
  it('exports the current service class', () => {
    expect(PublishingOrchestrationEngineService).toBeDefined();
    expect(typeof PublishingOrchestrationEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = PublishingOrchestrationEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(PublishingOrchestrationEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});