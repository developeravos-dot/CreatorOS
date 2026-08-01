import { AdvertisingRevenueEngineService } from './advertising-revenue-engine.service';

describe('AdvertisingRevenueEngineService', () => {
  it('should expose the current service class', () => {
    expect(AdvertisingRevenueEngineService).toBeDefined();
    expect(typeof AdvertisingRevenueEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(AdvertisingRevenueEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (AdvertisingRevenueEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(AdvertisingRevenueEngineService.name).toBe('AdvertisingRevenueEngineService');
  });
});