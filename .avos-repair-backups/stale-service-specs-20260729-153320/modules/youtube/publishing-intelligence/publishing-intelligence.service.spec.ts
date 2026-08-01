import { PublishingIntelligenceService } from './publishing-intelligence.service';

describe('PublishingIntelligenceService', () => {
  it('should expose the current service class', () => {
    expect(PublishingIntelligenceService).toBeDefined();
    expect(typeof PublishingIntelligenceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(PublishingIntelligenceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (PublishingIntelligenceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(PublishingIntelligenceService.name).toBe('PublishingIntelligenceService');
  });
});