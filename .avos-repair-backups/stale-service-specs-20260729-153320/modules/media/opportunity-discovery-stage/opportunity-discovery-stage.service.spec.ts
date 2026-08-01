import { OpportunityDiscoveryStageService } from './opportunity-discovery-stage.service';

describe('OpportunityDiscoveryStageService', () => {
  it('should expose the current service class', () => {
    expect(OpportunityDiscoveryStageService).toBeDefined();
    expect(typeof OpportunityDiscoveryStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(OpportunityDiscoveryStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (OpportunityDiscoveryStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(OpportunityDiscoveryStageService.name).toBe('OpportunityDiscoveryStageService');
  });
});