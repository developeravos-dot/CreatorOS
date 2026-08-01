import { BusinessModelIntelligenceStageService } from './business-model-intelligence-stage.service';

describe('BusinessModelIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(BusinessModelIntelligenceStageService).toBeDefined();
    expect(typeof BusinessModelIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(BusinessModelIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (BusinessModelIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(BusinessModelIntelligenceStageService.name).toBe('BusinessModelIntelligenceStageService');
  });
});