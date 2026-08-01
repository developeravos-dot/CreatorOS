import { WorkflowService } from './workflow.service';

describe('WorkflowService', () => {
  it('should expose the current service class', () => {
    expect(WorkflowService).toBeDefined();
    expect(typeof WorkflowService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(WorkflowService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (WorkflowService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(WorkflowService.name).toBe('WorkflowService');
  });
});