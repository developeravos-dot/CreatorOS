import { LicensingIntelligenceStageService } from './licensing-intelligence-stage.service';

describe('LicensingIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(LicensingIntelligenceStageService).toBeDefined();
    expect(typeof LicensingIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(LicensingIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (LicensingIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(LicensingIntelligenceStageService.name).toBe('LicensingIntelligenceStageService');
  });
});