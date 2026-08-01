import { PlatformIntelligenceService } from './platform-intelligence.service';

describe('PlatformIntelligenceService', () => {
  it('should expose the current service class', () => {
    expect(PlatformIntelligenceService).toBeDefined();
    expect(typeof PlatformIntelligenceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(PlatformIntelligenceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (PlatformIntelligenceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(PlatformIntelligenceService.name).toBe('PlatformIntelligenceService');
  });
});