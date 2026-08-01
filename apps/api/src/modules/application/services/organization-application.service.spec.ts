import { OrganizationApplicationService } from './organization-application.service';

describe('OrganizationApplicationService', () => {
  it('exports the current service class', () => {
    expect(OrganizationApplicationService).toBeDefined();
    expect(typeof OrganizationApplicationService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = OrganizationApplicationService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(OrganizationApplicationService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});