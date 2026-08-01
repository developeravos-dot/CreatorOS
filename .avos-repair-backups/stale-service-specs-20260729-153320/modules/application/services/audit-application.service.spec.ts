import { AuditApplicationService } from './audit-application.service';

describe('AuditApplicationService', () => {
  it('should expose the current service class', () => {
    expect(AuditApplicationService).toBeDefined();
    expect(typeof AuditApplicationService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(AuditApplicationService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (AuditApplicationService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(AuditApplicationService.name).toBe('AuditApplicationService');
  });
});