import { CrossPromotionIntelligenceStageService } from './cross-promotion-intelligence-stage.service';

describe('CrossPromotionIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(CrossPromotionIntelligenceStageService).toBeDefined();
    expect(typeof CrossPromotionIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CrossPromotionIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CrossPromotionIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});