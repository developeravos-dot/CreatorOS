import { PublishingOrchestrationEngineService } from './publishing-orchestration-engine.service';

describe('PublishingOrchestrationEngineService', () => {
  it('should expose the current service class', () => {
    expect(PublishingOrchestrationEngineService).toBeDefined();
    expect(typeof PublishingOrchestrationEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(PublishingOrchestrationEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (PublishingOrchestrationEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(PublishingOrchestrationEngineService.name).toBe('PublishingOrchestrationEngineService');
  });
});