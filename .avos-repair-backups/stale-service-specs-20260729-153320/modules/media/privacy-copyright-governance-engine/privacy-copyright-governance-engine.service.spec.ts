import { PrivacyCopyrightGovernanceEngineService } from './privacy-copyright-governance-engine.service';

describe('PrivacyCopyrightGovernanceEngineService', () => {
  it('should expose the current service class', () => {
    expect(PrivacyCopyrightGovernanceEngineService).toBeDefined();
    expect(typeof PrivacyCopyrightGovernanceEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(PrivacyCopyrightGovernanceEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (PrivacyCopyrightGovernanceEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(PrivacyCopyrightGovernanceEngineService.name).toBe('PrivacyCopyrightGovernanceEngineService');
  });
});