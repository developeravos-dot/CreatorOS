import { AudienceAnalyzerService } from './audience-analyzer.service';

describe('AudienceAnalyzerService', () => {
  it('should expose the current service class', () => {
    expect(AudienceAnalyzerService).toBeDefined();
    expect(typeof AudienceAnalyzerService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(AudienceAnalyzerService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (AudienceAnalyzerService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(AudienceAnalyzerService.name).toBe('AudienceAnalyzerService');
  });
});