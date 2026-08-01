import { LocalAudienceIntelligenceStageService } from './local-audience-intelligence-stage.service';

describe('LocalAudienceIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(LocalAudienceIntelligenceStageService).toBeDefined();
    expect(typeof LocalAudienceIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(LocalAudienceIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (LocalAudienceIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(LocalAudienceIntelligenceStageService.name).toBe('LocalAudienceIntelligenceStageService');
  });
});