import { WorkflowService } from './workflow.service';

describe('WorkflowService', () => {
  it('exports the current service class', () => {
    expect(WorkflowService).toBeDefined();
    expect(typeof WorkflowService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = WorkflowService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(WorkflowService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});