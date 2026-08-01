import { SponsorshipIntelligenceStageService } from './sponsorship-intelligence-stage.service';

describe('SponsorshipIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(SponsorshipIntelligenceStageService).toBeDefined();
    expect(typeof SponsorshipIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(SponsorshipIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (SponsorshipIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(SponsorshipIntelligenceStageService.name).toBe('SponsorshipIntelligenceStageService');
  });
});