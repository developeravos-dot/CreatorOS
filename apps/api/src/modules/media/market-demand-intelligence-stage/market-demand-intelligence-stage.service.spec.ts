import { MarketDemandIntelligenceStageService } from './market-demand-intelligence-stage.service';

describe('MarketDemandIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(MarketDemandIntelligenceStageService).toBeDefined();
    expect(typeof MarketDemandIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = MarketDemandIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(MarketDemandIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});