import { OrganizationApplicationService } from './organization-application.service';

describe('OrganizationApplicationService', () => {
  it('should expose the current service class', () => {
    expect(OrganizationApplicationService).toBeDefined();
    expect(typeof OrganizationApplicationService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(OrganizationApplicationService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (OrganizationApplicationService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(OrganizationApplicationService.name).toBe('OrganizationApplicationService');
  });
});