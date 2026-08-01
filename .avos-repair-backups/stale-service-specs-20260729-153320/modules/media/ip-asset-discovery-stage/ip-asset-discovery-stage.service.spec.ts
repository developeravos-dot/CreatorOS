import { IpAssetDiscoveryStageService } from './ip-asset-discovery-stage.service';

describe('IpAssetDiscoveryStageService', () => {
  it('should expose the current service class', () => {
    expect(IpAssetDiscoveryStageService).toBeDefined();
    expect(typeof IpAssetDiscoveryStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(IpAssetDiscoveryStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (IpAssetDiscoveryStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(IpAssetDiscoveryStageService.name).toBe('IpAssetDiscoveryStageService');
  });
});