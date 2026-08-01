import { FranchiseManagementStageService } from './franchise-management-stage.service';

describe('FranchiseManagementStageService', () => {
  it('exports the current service class', () => {
    expect(FranchiseManagementStageService).toBeDefined();
    expect(typeof FranchiseManagementStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = FranchiseManagementStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(FranchiseManagementStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});