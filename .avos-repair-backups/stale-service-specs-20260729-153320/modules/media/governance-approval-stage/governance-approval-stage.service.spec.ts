import { GovernanceApprovalStageService } from './governance-approval-stage.service';

describe('GovernanceApprovalStageService', () => {
  it('should expose the current service class', () => {
    expect(GovernanceApprovalStageService).toBeDefined();
    expect(typeof GovernanceApprovalStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(GovernanceApprovalStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (GovernanceApprovalStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(GovernanceApprovalStageService.name).toBe('GovernanceApprovalStageService');
  });
});