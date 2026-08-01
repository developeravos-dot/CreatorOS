import { ExecutionPlanApplicationService } from './execution-plan-application.service';

describe('ExecutionPlanApplicationService', () => {
  it('should expose the current service class', () => {
    expect(ExecutionPlanApplicationService).toBeDefined();
    expect(typeof ExecutionPlanApplicationService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ExecutionPlanApplicationService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ExecutionPlanApplicationService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ExecutionPlanApplicationService.name).toBe('ExecutionPlanApplicationService');
  });
});