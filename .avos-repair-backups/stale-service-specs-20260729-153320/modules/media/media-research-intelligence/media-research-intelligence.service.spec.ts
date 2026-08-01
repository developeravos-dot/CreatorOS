import { MediaResearchIntelligenceService } from './media-research-intelligence.service';

describe('MediaResearchIntelligenceService', () => {
  it('should expose the current service class', () => {
    expect(MediaResearchIntelligenceService).toBeDefined();
    expect(typeof MediaResearchIntelligenceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(MediaResearchIntelligenceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (MediaResearchIntelligenceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(MediaResearchIntelligenceService.name).toBe('MediaResearchIntelligenceService');
  });
});