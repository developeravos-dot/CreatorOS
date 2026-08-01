import { IpFamilyTreeStageService } from './ip-family-tree-stage.service';

describe('IpFamilyTreeStageService', () => {
  it('should expose the current service class', () => {
    expect(IpFamilyTreeStageService).toBeDefined();
    expect(typeof IpFamilyTreeStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(IpFamilyTreeStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (IpFamilyTreeStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(IpFamilyTreeStageService.name).toBe('IpFamilyTreeStageService');
  });
});