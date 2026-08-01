import { ApprovalApplicationService } from './approval-application.service';

describe('ApprovalApplicationService', () => {
  it('should expose the current service class', () => {
    expect(ApprovalApplicationService).toBeDefined();
    expect(typeof ApprovalApplicationService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ApprovalApplicationService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ApprovalApplicationService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ApprovalApplicationService.name).toBe('ApprovalApplicationService');
  });
});