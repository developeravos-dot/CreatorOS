import { EcosystemOrchestrationStageService } from './ecosystem-orchestration-stage.service';

describe('EcosystemOrchestrationStageService', () => {
  it('should expose the current service class', () => {
    expect(EcosystemOrchestrationStageService).toBeDefined();
    expect(typeof EcosystemOrchestrationStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(EcosystemOrchestrationStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (EcosystemOrchestrationStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(EcosystemOrchestrationStageService.name).toBe('EcosystemOrchestrationStageService');
  });
});