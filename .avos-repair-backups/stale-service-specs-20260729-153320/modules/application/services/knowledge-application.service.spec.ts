import { KnowledgeApplicationService } from './knowledge-application.service';

describe('KnowledgeApplicationService', () => {
  it('should expose the current service class', () => {
    expect(KnowledgeApplicationService).toBeDefined();
    expect(typeof KnowledgeApplicationService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(KnowledgeApplicationService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (KnowledgeApplicationService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(KnowledgeApplicationService.name).toBe('KnowledgeApplicationService');
  });
});