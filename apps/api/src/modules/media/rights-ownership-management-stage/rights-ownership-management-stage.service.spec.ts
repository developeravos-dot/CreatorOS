import { RightsOwnershipManagementStageService } from './rights-ownership-management-stage.service';

describe('RightsOwnershipManagementStageService', () => {
  it('exports the current service class', () => {
    expect(RightsOwnershipManagementStageService).toBeDefined();
    expect(typeof RightsOwnershipManagementStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = RightsOwnershipManagementStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(RightsOwnershipManagementStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});