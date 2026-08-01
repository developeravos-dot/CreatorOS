import { MediaAgentRegistryEngineService } from './media-agent-registry-engine.service';

describe('MediaAgentRegistryEngineService', () => {
  it('should expose the current service class', () => {
    expect(MediaAgentRegistryEngineService).toBeDefined();
    expect(typeof MediaAgentRegistryEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(MediaAgentRegistryEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (MediaAgentRegistryEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(MediaAgentRegistryEngineService.name).toBe('MediaAgentRegistryEngineService');
  });
});