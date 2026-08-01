import { KnowledgeIntelligenceService } from './knowledge-intelligence.service';

describe('KnowledgeIntelligenceService', () => {
  it('exports the current service class', () => {
    expect(KnowledgeIntelligenceService).toBeDefined();
    expect(typeof KnowledgeIntelligenceService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = KnowledgeIntelligenceService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(KnowledgeIntelligenceService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});