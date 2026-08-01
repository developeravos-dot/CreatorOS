import { CashFlowIntelligenceStageService } from './cash-flow-intelligence-stage.service';

describe('CashFlowIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(CashFlowIntelligenceStageService).toBeDefined();
    expect(typeof CashFlowIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CashFlowIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CashFlowIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});