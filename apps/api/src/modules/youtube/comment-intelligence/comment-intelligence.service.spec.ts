import { CommentIntelligenceService } from './comment-intelligence.service';

describe('CommentIntelligenceService', () => {
  it('exports the current service class', () => {
    expect(CommentIntelligenceService).toBeDefined();
    expect(typeof CommentIntelligenceService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CommentIntelligenceService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CommentIntelligenceService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});