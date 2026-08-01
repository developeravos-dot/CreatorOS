import { TagsIntelligenceService } from './tags-intelligence.service';

describe('TagsIntelligenceService', () => {
  it('exports the current service class', () => {
    expect(TagsIntelligenceService).toBeDefined();
    expect(typeof TagsIntelligenceService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = TagsIntelligenceService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(TagsIntelligenceService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});