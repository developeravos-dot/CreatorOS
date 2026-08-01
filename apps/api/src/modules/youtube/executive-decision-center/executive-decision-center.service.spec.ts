import { ExecutiveDecisionCenterService } from './executive-decision-center.service';

describe('ExecutiveDecisionCenterService', () => {
  it('exports the current service class', () => {
    expect(ExecutiveDecisionCenterService).toBeDefined();
    expect(typeof ExecutiveDecisionCenterService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ExecutiveDecisionCenterService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ExecutiveDecisionCenterService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});