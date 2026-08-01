import { AgentCoordinationService } from './agent-coordination.service';

describe('AgentCoordinationService', () => {
  it('exports the current service class', () => {
    expect(AgentCoordinationService).toBeDefined();
    expect(typeof AgentCoordinationService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = AgentCoordinationService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(AgentCoordinationService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});