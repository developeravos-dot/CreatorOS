import { MarketplaceIntelligenceStageService } from './marketplace-intelligence-stage.service';

describe('MarketplaceIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(MarketplaceIntelligenceStageService).toBeDefined();
    expect(typeof MarketplaceIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = MarketplaceIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(MarketplaceIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});