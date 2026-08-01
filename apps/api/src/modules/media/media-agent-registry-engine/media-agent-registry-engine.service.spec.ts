import { MediaAgentRegistryEngineService } from './media-agent-registry-engine.service';

describe('MediaAgentRegistryEngineService', () => {
  it('exports the current service class', () => {
    expect(MediaAgentRegistryEngineService).toBeDefined();
    expect(typeof MediaAgentRegistryEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = MediaAgentRegistryEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(MediaAgentRegistryEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});