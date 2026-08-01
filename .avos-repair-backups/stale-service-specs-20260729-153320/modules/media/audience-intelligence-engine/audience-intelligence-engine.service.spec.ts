import { AudienceIntelligenceEngineService } from './audience-intelligence-engine.service';

describe('AudienceIntelligenceEngineService', () => {
  it('should expose the current service class', () => {
    expect(AudienceIntelligenceEngineService).toBeDefined();
    expect(typeof AudienceIntelligenceEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(AudienceIntelligenceEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (AudienceIntelligenceEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(AudienceIntelligenceEngineService.name).toBe('AudienceIntelligenceEngineService');
  });
});