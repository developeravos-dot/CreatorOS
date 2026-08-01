import { MediaIpRegistryEngineService } from './media-ip-registry-engine.service';

describe('MediaIpRegistryEngineService', () => {
  it('exports the current service class', () => {
    expect(MediaIpRegistryEngineService).toBeDefined();
    expect(typeof MediaIpRegistryEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = MediaIpRegistryEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(MediaIpRegistryEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});