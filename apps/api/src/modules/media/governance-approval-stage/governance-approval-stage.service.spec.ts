import { GovernanceApprovalStageService } from './governance-approval-stage.service';

describe('GovernanceApprovalStageService', () => {
  it('exports the current service class', () => {
    expect(GovernanceApprovalStageService).toBeDefined();
    expect(typeof GovernanceApprovalStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = GovernanceApprovalStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(GovernanceApprovalStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});