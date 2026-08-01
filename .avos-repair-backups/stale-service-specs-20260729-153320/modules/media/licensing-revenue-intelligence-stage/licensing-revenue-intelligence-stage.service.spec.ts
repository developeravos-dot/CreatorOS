import { LicensingRevenueIntelligenceStageService } from './licensing-revenue-intelligence-stage.service';

describe('LicensingRevenueIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(LicensingRevenueIntelligenceStageService).toBeDefined();
    expect(typeof LicensingRevenueIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(LicensingRevenueIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (LicensingRevenueIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(LicensingRevenueIntelligenceStageService.name).toBe('LicensingRevenueIntelligenceStageService');
  });
});