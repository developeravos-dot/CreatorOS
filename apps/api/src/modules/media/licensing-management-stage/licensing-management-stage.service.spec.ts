import { LicensingManagementStageService } from './licensing-management-stage.service';

describe('LicensingManagementStageService', () => {
  it('exports the current service class', () => {
    expect(LicensingManagementStageService).toBeDefined();
    expect(typeof LicensingManagementStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = LicensingManagementStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(LicensingManagementStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});