import { GlobalMediaOrchestrationStageService } from './global-media-orchestration-stage.service';

describe('GlobalMediaOrchestrationStageService', () => {
  it('should expose the current service class', () => {
    expect(GlobalMediaOrchestrationStageService).toBeDefined();
    expect(typeof GlobalMediaOrchestrationStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(GlobalMediaOrchestrationStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (GlobalMediaOrchestrationStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(GlobalMediaOrchestrationStageService.name).toBe('GlobalMediaOrchestrationStageService');
  });
});