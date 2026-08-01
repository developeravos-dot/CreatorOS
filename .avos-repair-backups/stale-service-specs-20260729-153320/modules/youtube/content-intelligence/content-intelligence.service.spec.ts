import { ContentIntelligenceService } from './content-intelligence.service';

describe('ContentIntelligenceService', () => {
  it('should expose the current service class', () => {
    expect(ContentIntelligenceService).toBeDefined();
    expect(typeof ContentIntelligenceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ContentIntelligenceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ContentIntelligenceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ContentIntelligenceService.name).toBe('ContentIntelligenceService');
  });
});