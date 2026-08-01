import { ApprovalApplicationService } from './approval-application.service';

describe('ApprovalApplicationService', () => {
  it('exports the current service class', () => {
    expect(ApprovalApplicationService).toBeDefined();
    expect(typeof ApprovalApplicationService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ApprovalApplicationService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ApprovalApplicationService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});