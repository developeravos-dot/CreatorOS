import { AudienceIntelligenceStageService } from './audience-intelligence-stage.service';

describe('AudienceIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(AudienceIntelligenceStageService).toBeDefined();
    expect(typeof AudienceIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(AudienceIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (AudienceIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(AudienceIntelligenceStageService.name).toBe('AudienceIntelligenceStageService');
  });
});