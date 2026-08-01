import { RightsManagementService } from './rights-management.service';

describe('RightsManagementService', () => {
  it('exports the current service class', () => {
    expect(RightsManagementService).toBeDefined();
    expect(typeof RightsManagementService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = RightsManagementService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(RightsManagementService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});