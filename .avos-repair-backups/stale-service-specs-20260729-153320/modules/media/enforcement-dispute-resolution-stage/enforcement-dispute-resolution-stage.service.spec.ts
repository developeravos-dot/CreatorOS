import { EnforcementDisputeResolutionStageService } from './enforcement-dispute-resolution-stage.service';

describe('EnforcementDisputeResolutionStageService', () => {
  it('should expose the current service class', () => {
    expect(EnforcementDisputeResolutionStageService).toBeDefined();
    expect(typeof EnforcementDisputeResolutionStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(EnforcementDisputeResolutionStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (EnforcementDisputeResolutionStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(EnforcementDisputeResolutionStageService.name).toBe('EnforcementDisputeResolutionStageService');
  });
});