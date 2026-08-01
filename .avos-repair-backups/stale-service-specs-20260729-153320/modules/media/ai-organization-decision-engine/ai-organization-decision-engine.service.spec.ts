import { AiOrganizationDecisionEngineService } from './ai-organization-decision-engine.service';

describe('AiOrganizationDecisionEngineService', () => {
  it('should expose the current service class', () => {
    expect(AiOrganizationDecisionEngineService).toBeDefined();
    expect(typeof AiOrganizationDecisionEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(AiOrganizationDecisionEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (AiOrganizationDecisionEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(AiOrganizationDecisionEngineService.name).toBe('AiOrganizationDecisionEngineService');
  });
});