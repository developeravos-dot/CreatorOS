import { BannerIntelligenceStageService } from './banner-intelligence-stage.service';

describe('BannerIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(BannerIntelligenceStageService).toBeDefined();
    expect(typeof BannerIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(BannerIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (BannerIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(BannerIntelligenceStageService.name).toBe('BannerIntelligenceStageService');
  });
});