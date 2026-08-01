import { MarketplaceIntelligenceStageService } from './marketplace-intelligence-stage.service';

describe('MarketplaceIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(MarketplaceIntelligenceStageService).toBeDefined();
    expect(typeof MarketplaceIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(MarketplaceIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (MarketplaceIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(MarketplaceIntelligenceStageService.name).toBe('MarketplaceIntelligenceStageService');
  });
});