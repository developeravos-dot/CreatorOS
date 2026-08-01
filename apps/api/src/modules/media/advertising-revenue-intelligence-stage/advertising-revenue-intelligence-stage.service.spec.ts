import { AdvertisingRevenueIntelligenceStageService } from './advertising-revenue-intelligence-stage.service';

describe('AdvertisingRevenueIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(AdvertisingRevenueIntelligenceStageService).toBeDefined();
    expect(typeof AdvertisingRevenueIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = AdvertisingRevenueIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(AdvertisingRevenueIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});