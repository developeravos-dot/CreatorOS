import { TagsIntelligenceService } from './tags-intelligence.service';

describe('TagsIntelligenceService', () => {
  it('should expose the current service class', () => {
    expect(TagsIntelligenceService).toBeDefined();
    expect(typeof TagsIntelligenceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(TagsIntelligenceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (TagsIntelligenceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(TagsIntelligenceService.name).toBe('TagsIntelligenceService');
  });
});