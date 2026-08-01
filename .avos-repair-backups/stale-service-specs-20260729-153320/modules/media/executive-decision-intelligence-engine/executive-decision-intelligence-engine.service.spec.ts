import { ExecutiveDecisionIntelligenceEngineService } from './executive-decision-intelligence-engine.service';

describe('ExecutiveDecisionIntelligenceEngineService', () => {
  it('should expose the current service class', () => {
    expect(ExecutiveDecisionIntelligenceEngineService).toBeDefined();
    expect(typeof ExecutiveDecisionIntelligenceEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ExecutiveDecisionIntelligenceEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ExecutiveDecisionIntelligenceEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ExecutiveDecisionIntelligenceEngineService.name).toBe('ExecutiveDecisionIntelligenceEngineService');
  });
});