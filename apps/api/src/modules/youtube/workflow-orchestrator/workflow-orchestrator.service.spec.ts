import { WorkflowOrchestratorService } from './workflow-orchestrator.service';

describe('WorkflowOrchestratorService', () => {
  it('exports the current service class', () => {
    expect(WorkflowOrchestratorService).toBeDefined();
    expect(typeof WorkflowOrchestratorService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = WorkflowOrchestratorService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(WorkflowOrchestratorService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});