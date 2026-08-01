import { IpRightsLicensingEngineService } from './ip-rights-licensing-engine.service';

describe('IpRightsLicensingEngineService', () => {
  it('exports the current service class', () => {
    expect(IpRightsLicensingEngineService).toBeDefined();
    expect(typeof IpRightsLicensingEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = IpRightsLicensingEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(IpRightsLicensingEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});