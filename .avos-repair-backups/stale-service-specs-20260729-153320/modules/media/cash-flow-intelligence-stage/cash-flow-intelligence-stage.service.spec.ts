import { CashFlowIntelligenceStageService } from './cash-flow-intelligence-stage.service';

describe('CashFlowIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(CashFlowIntelligenceStageService).toBeDefined();
    expect(typeof CashFlowIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(CashFlowIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (CashFlowIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(CashFlowIntelligenceStageService.name).toBe('CashFlowIntelligenceStageService');
  });
});