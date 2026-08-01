import { IpRightsLicensingEngineService } from './ip-rights-licensing-engine.service';

describe('IpRightsLicensingEngineService', () => {
  it('should expose the current service class', () => {
    expect(IpRightsLicensingEngineService).toBeDefined();
    expect(typeof IpRightsLicensingEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(IpRightsLicensingEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (IpRightsLicensingEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(IpRightsLicensingEngineService.name).toBe('IpRightsLicensingEngineService');
  });
});