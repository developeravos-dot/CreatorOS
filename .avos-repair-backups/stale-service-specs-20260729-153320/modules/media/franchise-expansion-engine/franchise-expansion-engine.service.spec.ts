import { FranchiseExpansionEngineService } from './franchise-expansion-engine.service';

describe('FranchiseExpansionEngineService', () => {
  it('should expose the current service class', () => {
    expect(FranchiseExpansionEngineService).toBeDefined();
    expect(typeof FranchiseExpansionEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(FranchiseExpansionEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (FranchiseExpansionEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(FranchiseExpansionEngineService.name).toBe('FranchiseExpansionEngineService');
  });
});