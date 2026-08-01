import { GlobalRiskGovernanceStageService } from './global-risk-governance-stage.service';

describe('GlobalRiskGovernanceStageService', () => {
  it('should expose the current service class', () => {
    expect(GlobalRiskGovernanceStageService).toBeDefined();
    expect(typeof GlobalRiskGovernanceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(GlobalRiskGovernanceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (GlobalRiskGovernanceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(GlobalRiskGovernanceStageService.name).toBe('GlobalRiskGovernanceStageService');
  });
});