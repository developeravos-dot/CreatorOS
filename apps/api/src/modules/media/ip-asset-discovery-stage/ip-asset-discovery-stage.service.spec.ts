import { IpAssetDiscoveryStageService } from './ip-asset-discovery-stage.service';

describe('IpAssetDiscoveryStageService', () => {
  it('exports the current service class', () => {
    expect(IpAssetDiscoveryStageService).toBeDefined();
    expect(typeof IpAssetDiscoveryStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = IpAssetDiscoveryStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(IpAssetDiscoveryStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});