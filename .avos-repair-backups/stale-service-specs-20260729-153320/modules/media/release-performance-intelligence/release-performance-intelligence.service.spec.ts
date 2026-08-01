import { ReleasePerformanceIntelligenceService } from './release-performance-intelligence.service';

describe('ReleasePerformanceIntelligenceService', () => {
  it('should expose the current service class', () => {
    expect(ReleasePerformanceIntelligenceService).toBeDefined();
    expect(typeof ReleasePerformanceIntelligenceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ReleasePerformanceIntelligenceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ReleasePerformanceIntelligenceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ReleasePerformanceIntelligenceService.name).toBe('ReleasePerformanceIntelligenceService');
  });
});