import { MediaResearchService } from './media-research.service';

describe('MediaResearchService', () => {
  it('should expose the current service class', () => {
    expect(MediaResearchService).toBeDefined();
    expect(typeof MediaResearchService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(MediaResearchService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (MediaResearchService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(MediaResearchService.name).toBe('MediaResearchService');
  });
});