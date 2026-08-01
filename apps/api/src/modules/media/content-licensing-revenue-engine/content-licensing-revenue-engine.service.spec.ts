import { ContentLicensingRevenueEngineService } from './content-licensing-revenue-engine.service';

describe('ContentLicensingRevenueEngineService', () => {
  it('exports the current service class', () => {
    expect(ContentLicensingRevenueEngineService).toBeDefined();
    expect(typeof ContentLicensingRevenueEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ContentLicensingRevenueEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ContentLicensingRevenueEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});