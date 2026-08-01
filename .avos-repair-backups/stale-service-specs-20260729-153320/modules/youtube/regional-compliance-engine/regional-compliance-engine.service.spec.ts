import { RegionalComplianceEngineService } from './regional-compliance-engine.service';

describe('RegionalComplianceEngineService', () => {
  it('should expose the current service class', () => {
    expect(RegionalComplianceEngineService).toBeDefined();
    expect(typeof RegionalComplianceEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(RegionalComplianceEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (RegionalComplianceEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(RegionalComplianceEngineService.name).toBe('RegionalComplianceEngineService');
  });
});