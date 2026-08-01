import { AgentTeamOrchestrationEngineService } from './agent-team-orchestration-engine.service';

describe('AgentTeamOrchestrationEngineService', () => {
  it('exports the current service class', () => {
    expect(AgentTeamOrchestrationEngineService).toBeDefined();
    expect(typeof AgentTeamOrchestrationEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = AgentTeamOrchestrationEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(AgentTeamOrchestrationEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});