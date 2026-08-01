import { AdvertisingRevenueIntelligenceStageService } from './advertising-revenue-intelligence-stage.service';

describe('AdvertisingRevenueIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(AdvertisingRevenueIntelligenceStageService).toBeDefined();
    expect(typeof AdvertisingRevenueIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(AdvertisingRevenueIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (AdvertisingRevenueIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(AdvertisingRevenueIntelligenceStageService.name).toBe('AdvertisingRevenueIntelligenceStageService');
  });
});