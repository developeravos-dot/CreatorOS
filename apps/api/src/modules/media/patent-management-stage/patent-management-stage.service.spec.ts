import { PatentManagementStageService } from './patent-management-stage.service';

describe('PatentManagementStageService', () => {
  it('exports the current service class', () => {
    expect(PatentManagementStageService).toBeDefined();
    expect(typeof PatentManagementStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = PatentManagementStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(PatentManagementStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});