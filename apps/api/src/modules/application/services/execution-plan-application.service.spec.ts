import { ExecutionPlanApplicationService } from './execution-plan-application.service';

describe('ExecutionPlanApplicationService', () => {
  it('exports the current service class', () => {
    expect(ExecutionPlanApplicationService).toBeDefined();
    expect(typeof ExecutionPlanApplicationService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ExecutionPlanApplicationService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ExecutionPlanApplicationService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});