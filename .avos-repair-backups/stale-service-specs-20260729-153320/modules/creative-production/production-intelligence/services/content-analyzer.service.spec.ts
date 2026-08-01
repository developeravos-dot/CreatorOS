import { ContentAnalyzerService } from './content-analyzer.service';

describe('ContentAnalyzerService', () => {
  it('should expose the current service class', () => {
    expect(ContentAnalyzerService).toBeDefined();
    expect(typeof ContentAnalyzerService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ContentAnalyzerService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ContentAnalyzerService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ContentAnalyzerService.name).toBe('ContentAnalyzerService');
  });
});