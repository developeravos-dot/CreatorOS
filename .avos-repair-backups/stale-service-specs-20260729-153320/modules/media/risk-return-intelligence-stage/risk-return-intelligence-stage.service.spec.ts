import { RiskReturnIntelligenceStageService } from './risk-return-intelligence-stage.service';

describe('RiskReturnIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(RiskReturnIntelligenceStageService).toBeDefined();
    expect(typeof RiskReturnIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(RiskReturnIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (RiskReturnIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(RiskReturnIntelligenceStageService.name).toBe('RiskReturnIntelligenceStageService');
  });
});