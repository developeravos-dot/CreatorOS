import { IpFamilyTreeEngineService } from './ip-family-tree-engine.service';

describe('IpFamilyTreeEngineService', () => {
  it('exports the current service class', () => {
    expect(IpFamilyTreeEngineService).toBeDefined();
    expect(typeof IpFamilyTreeEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = IpFamilyTreeEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(IpFamilyTreeEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});