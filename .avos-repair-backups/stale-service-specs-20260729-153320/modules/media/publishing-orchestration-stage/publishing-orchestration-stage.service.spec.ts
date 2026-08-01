import { PublishingOrchestrationStageService } from './publishing-orchestration-stage.service';

describe('PublishingOrchestrationStageService', () => {
  it('should expose the current service class', () => {
    expect(PublishingOrchestrationStageService).toBeDefined();
    expect(typeof PublishingOrchestrationStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(PublishingOrchestrationStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (PublishingOrchestrationStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(PublishingOrchestrationStageService.name).toBe('PublishingOrchestrationStageService');
  });
});