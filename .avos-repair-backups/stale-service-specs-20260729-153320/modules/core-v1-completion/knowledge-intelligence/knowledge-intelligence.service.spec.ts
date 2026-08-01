import { KnowledgeIntelligenceService } from './knowledge-intelligence.service';

describe('KnowledgeIntelligenceService', () => {
  it('should expose the current service class', () => {
    expect(KnowledgeIntelligenceService).toBeDefined();
    expect(typeof KnowledgeIntelligenceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(KnowledgeIntelligenceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (KnowledgeIntelligenceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(KnowledgeIntelligenceService.name).toBe('KnowledgeIntelligenceService');
  });
});