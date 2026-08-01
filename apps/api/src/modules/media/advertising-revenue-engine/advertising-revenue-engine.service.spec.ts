import { AdvertisingRevenueEngineService } from './advertising-revenue-engine.service';

describe('AdvertisingRevenueEngineService', () => {
  it('exports the current service class', () => {
    expect(AdvertisingRevenueEngineService).toBeDefined();
    expect(typeof AdvertisingRevenueEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = AdvertisingRevenueEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(AdvertisingRevenueEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});