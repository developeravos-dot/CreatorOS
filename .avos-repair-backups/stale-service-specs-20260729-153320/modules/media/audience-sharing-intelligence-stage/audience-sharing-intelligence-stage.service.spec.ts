import { AudienceSharingIntelligenceStageService } from './audience-sharing-intelligence-stage.service';

describe('AudienceSharingIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(AudienceSharingIntelligenceStageService).toBeDefined();
    expect(typeof AudienceSharingIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(AudienceSharingIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (AudienceSharingIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(AudienceSharingIntelligenceStageService.name).toBe('AudienceSharingIntelligenceStageService');
  });
});