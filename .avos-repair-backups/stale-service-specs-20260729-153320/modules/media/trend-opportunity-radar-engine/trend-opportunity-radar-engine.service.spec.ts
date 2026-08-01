import { TrendOpportunityRadarEngineService } from './trend-opportunity-radar-engine.service';

describe('TrendOpportunityRadarEngineService', () => {
  it('should expose the current service class', () => {
    expect(TrendOpportunityRadarEngineService).toBeDefined();
    expect(typeof TrendOpportunityRadarEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(TrendOpportunityRadarEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (TrendOpportunityRadarEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(TrendOpportunityRadarEngineService.name).toBe('TrendOpportunityRadarEngineService');
  });
});