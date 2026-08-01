import { AgentApplicationService } from './agent-application.service';

describe('AgentApplicationService', () => {
  it('should expose the current service class', () => {
    expect(AgentApplicationService).toBeDefined();
    expect(typeof AgentApplicationService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(AgentApplicationService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (AgentApplicationService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(AgentApplicationService.name).toBe('AgentApplicationService');
  });
});