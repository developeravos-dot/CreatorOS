import { SharedAgentMemoryEngineService } from './shared-agent-memory-engine.service';

describe('SharedAgentMemoryEngineService', () => {
  it('exports the current service class', () => {
    expect(SharedAgentMemoryEngineService).toBeDefined();
    expect(typeof SharedAgentMemoryEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = SharedAgentMemoryEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(SharedAgentMemoryEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});