import { CrossPromotionStageService } from './cross-promotion-stage.service';

describe('CrossPromotionStageService', () => {
  it('should expose the current service class', () => {
    expect(CrossPromotionStageService).toBeDefined();
    expect(typeof CrossPromotionStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(CrossPromotionStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (CrossPromotionStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(CrossPromotionStageService.name).toBe('CrossPromotionStageService');
  });
});