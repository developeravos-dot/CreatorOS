import { CopyrightManagementStageService } from './copyright-management-stage.service';

describe('CopyrightManagementStageService', () => {
  it('exports the current service class', () => {
    expect(CopyrightManagementStageService).toBeDefined();
    expect(typeof CopyrightManagementStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CopyrightManagementStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CopyrightManagementStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});