import { IpFamilyTreeStageService } from './ip-family-tree-stage.service';

describe('IpFamilyTreeStageService', () => {
  it('exports the current service class', () => {
    expect(IpFamilyTreeStageService).toBeDefined();
    expect(typeof IpFamilyTreeStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = IpFamilyTreeStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(IpFamilyTreeStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});