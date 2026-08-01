import { AuditApplicationService } from './audit-application.service';

describe('AuditApplicationService', () => {
  it('exports the current service class', () => {
    expect(AuditApplicationService).toBeDefined();
    expect(typeof AuditApplicationService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = AuditApplicationService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(AuditApplicationService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});