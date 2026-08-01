import { CommentIntelligenceService } from './comment-intelligence.service';

describe('CommentIntelligenceService', () => {
  it('should expose the current service class', () => {
    expect(CommentIntelligenceService).toBeDefined();
    expect(typeof CommentIntelligenceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(CommentIntelligenceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (CommentIntelligenceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(CommentIntelligenceService.name).toBe('CommentIntelligenceService');
  });
});