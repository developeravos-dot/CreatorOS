import { MediaWorkflowOrchestrationEngineService } from './media-workflow-orchestration-engine.service';

describe('MediaWorkflowOrchestrationEngineService', () => {
  it('exports the current service class', () => {
    expect(MediaWorkflowOrchestrationEngineService).toBeDefined();
    expect(typeof MediaWorkflowOrchestrationEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = MediaWorkflowOrchestrationEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(MediaWorkflowOrchestrationEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});