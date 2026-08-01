import { RiskReturnIntelligenceStageService } from './risk-return-intelligence-stage.service';

describe('RiskReturnIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(RiskReturnIntelligenceStageService).toBeDefined();
    expect(typeof RiskReturnIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = RiskReturnIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(RiskReturnIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});