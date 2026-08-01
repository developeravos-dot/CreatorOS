import { MediaResearchIntelligenceService } from './media-research-intelligence.service';

describe('MediaResearchIntelligenceService', () => {
  it('exports the current service class', () => {
    expect(MediaResearchIntelligenceService).toBeDefined();
    expect(typeof MediaResearchIntelligenceService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = MediaResearchIntelligenceService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(MediaResearchIntelligenceService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});