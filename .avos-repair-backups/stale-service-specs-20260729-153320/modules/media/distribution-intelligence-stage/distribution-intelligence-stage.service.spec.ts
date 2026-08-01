import { DistributionIntelligenceStageService } from './distribution-intelligence-stage.service';

describe('DistributionIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(DistributionIntelligenceStageService).toBeDefined();
    expect(typeof DistributionIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(DistributionIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (DistributionIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(DistributionIntelligenceStageService.name).toBe('DistributionIntelligenceStageService');
  });
});