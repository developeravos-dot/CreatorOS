import { SharedAgentMemoryEngineService } from './shared-agent-memory-engine.service';

describe('SharedAgentMemoryEngineService', () => {
  it('should expose the current service class', () => {
    expect(SharedAgentMemoryEngineService).toBeDefined();
    expect(typeof SharedAgentMemoryEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(SharedAgentMemoryEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (SharedAgentMemoryEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(SharedAgentMemoryEngineService.name).toBe('SharedAgentMemoryEngineService');
  });
});