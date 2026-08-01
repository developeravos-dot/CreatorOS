import { WorkflowOrchestratorService } from './workflow-orchestrator.service';

describe('WorkflowOrchestratorService', () => {
  it('should expose the current service class', () => {
    expect(WorkflowOrchestratorService).toBeDefined();
    expect(typeof WorkflowOrchestratorService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(WorkflowOrchestratorService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (WorkflowOrchestratorService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(WorkflowOrchestratorService.name).toBe('WorkflowOrchestratorService');
  });
});