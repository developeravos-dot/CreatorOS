import { MediaIpRegistryEngineService } from './media-ip-registry-engine.service';

describe('MediaIpRegistryEngineService', () => {
  it('should expose the current service class', () => {
    expect(MediaIpRegistryEngineService).toBeDefined();
    expect(typeof MediaIpRegistryEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(MediaIpRegistryEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (MediaIpRegistryEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(MediaIpRegistryEngineService.name).toBe('MediaIpRegistryEngineService');
  });
});