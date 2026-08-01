import { EcosystemOrchestrationStageService } from './ecosystem-orchestration-stage.service';

describe('EcosystemOrchestrationStageService', () => {
  it('exports the current service class', () => {
    expect(EcosystemOrchestrationStageService).toBeDefined();
    expect(typeof EcosystemOrchestrationStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = EcosystemOrchestrationStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(EcosystemOrchestrationStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});