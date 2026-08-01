import { AgentApplicationService } from './agent-application.service';

describe('AgentApplicationService', () => {
  it('exports the current service class', () => {
    expect(AgentApplicationService).toBeDefined();
    expect(typeof AgentApplicationService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = AgentApplicationService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(AgentApplicationService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});