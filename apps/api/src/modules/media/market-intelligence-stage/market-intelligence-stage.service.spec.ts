import { MarketIntelligenceStageService } from './market-intelligence-stage.service';

describe('MarketIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(MarketIntelligenceStageService).toBeDefined();
    expect(typeof MarketIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = MarketIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(MarketIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});