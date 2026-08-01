import { IpFamilyTreeEngineService } from './ip-family-tree-engine.service';

describe('IpFamilyTreeEngineService', () => {
  it('should expose the current service class', () => {
    expect(IpFamilyTreeEngineService).toBeDefined();
    expect(typeof IpFamilyTreeEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(IpFamilyTreeEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (IpFamilyTreeEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(IpFamilyTreeEngineService.name).toBe('IpFamilyTreeEngineService');
  });
});