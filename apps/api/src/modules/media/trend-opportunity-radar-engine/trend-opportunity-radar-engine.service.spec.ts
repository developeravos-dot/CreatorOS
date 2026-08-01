import { TrendOpportunityRadarEngineService } from './trend-opportunity-radar-engine.service';

describe('TrendOpportunityRadarEngineService', () => {
  it('exports the current service class', () => {
    expect(TrendOpportunityRadarEngineService).toBeDefined();
    expect(typeof TrendOpportunityRadarEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = TrendOpportunityRadarEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(TrendOpportunityRadarEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});