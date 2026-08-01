import { CrossPromotionStageService } from './cross-promotion-stage.service';

describe('CrossPromotionStageService', () => {
  it('exports the current service class', () => {
    expect(CrossPromotionStageService).toBeDefined();
    expect(typeof CrossPromotionStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CrossPromotionStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CrossPromotionStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});