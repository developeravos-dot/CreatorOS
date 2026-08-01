import { MarketPerformanceIntelligenceStageService } from './market-performance-intelligence-stage.service';

describe('MarketPerformanceIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(MarketPerformanceIntelligenceStageService).toBeDefined();
    expect(typeof MarketPerformanceIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = MarketPerformanceIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(MarketPerformanceIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});