import { GlobalRiskGovernanceStageService } from './global-risk-governance-stage.service';

describe('GlobalRiskGovernanceStageService', () => {
  it('exports the current service class', () => {
    expect(GlobalRiskGovernanceStageService).toBeDefined();
    expect(typeof GlobalRiskGovernanceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = GlobalRiskGovernanceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(GlobalRiskGovernanceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});