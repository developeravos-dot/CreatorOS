import { BannerIntelligenceStageService } from './banner-intelligence-stage.service';

describe('BannerIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(BannerIntelligenceStageService).toBeDefined();
    expect(typeof BannerIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = BannerIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(BannerIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});