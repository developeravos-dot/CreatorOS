import { AgentCoordinationService } from './agent-coordination.service';

describe('AgentCoordinationService', () => {
  it('should expose the current service class', () => {
    expect(AgentCoordinationService).toBeDefined();
    expect(typeof AgentCoordinationService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(AgentCoordinationService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (AgentCoordinationService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(AgentCoordinationService.name).toBe('AgentCoordinationService');
  });
});