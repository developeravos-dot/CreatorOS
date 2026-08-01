import { CrossPromotionIntelligenceStageService } from './cross-promotion-intelligence-stage.service';

describe('CrossPromotionIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(CrossPromotionIntelligenceStageService).toBeDefined();
    expect(typeof CrossPromotionIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(CrossPromotionIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (CrossPromotionIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(CrossPromotionIntelligenceStageService.name).toBe('CrossPromotionIntelligenceStageService');
  });
});