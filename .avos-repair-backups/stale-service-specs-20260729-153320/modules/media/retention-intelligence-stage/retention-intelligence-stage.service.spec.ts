import { RetentionIntelligenceStageService } from './retention-intelligence-stage.service';

describe('RetentionIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(RetentionIntelligenceStageService).toBeDefined();
    expect(typeof RetentionIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(RetentionIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (RetentionIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(RetentionIntelligenceStageService.name).toBe('RetentionIntelligenceStageService');
  });
});