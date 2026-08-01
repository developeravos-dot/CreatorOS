import { LicensingRevenueIntelligenceStageService } from './licensing-revenue-intelligence-stage.service';

describe('LicensingRevenueIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(LicensingRevenueIntelligenceStageService).toBeDefined();
    expect(typeof LicensingRevenueIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = LicensingRevenueIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(LicensingRevenueIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});