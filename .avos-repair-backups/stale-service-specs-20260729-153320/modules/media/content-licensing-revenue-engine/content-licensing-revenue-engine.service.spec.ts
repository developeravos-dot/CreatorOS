import { ContentLicensingRevenueEngineService } from './content-licensing-revenue-engine.service';

describe('ContentLicensingRevenueEngineService', () => {
  it('should expose the current service class', () => {
    expect(ContentLicensingRevenueEngineService).toBeDefined();
    expect(typeof ContentLicensingRevenueEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ContentLicensingRevenueEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ContentLicensingRevenueEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ContentLicensingRevenueEngineService.name).toBe('ContentLicensingRevenueEngineService');
  });
});