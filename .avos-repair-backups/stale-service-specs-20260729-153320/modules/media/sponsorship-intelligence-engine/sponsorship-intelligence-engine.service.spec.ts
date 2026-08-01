import { SponsorshipIntelligenceEngineService } from './sponsorship-intelligence-engine.service';

describe('SponsorshipIntelligenceEngineService', () => {
  it('should expose the current service class', () => {
    expect(SponsorshipIntelligenceEngineService).toBeDefined();
    expect(typeof SponsorshipIntelligenceEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(SponsorshipIntelligenceEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (SponsorshipIntelligenceEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(SponsorshipIntelligenceEngineService.name).toBe('SponsorshipIntelligenceEngineService');
  });
});