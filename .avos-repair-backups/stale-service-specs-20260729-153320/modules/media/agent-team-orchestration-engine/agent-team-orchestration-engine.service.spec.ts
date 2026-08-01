import { AgentTeamOrchestrationEngineService } from './agent-team-orchestration-engine.service';

describe('AgentTeamOrchestrationEngineService', () => {
  it('should expose the current service class', () => {
    expect(AgentTeamOrchestrationEngineService).toBeDefined();
    expect(typeof AgentTeamOrchestrationEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(AgentTeamOrchestrationEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (AgentTeamOrchestrationEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(AgentTeamOrchestrationEngineService.name).toBe('AgentTeamOrchestrationEngineService');
  });
});