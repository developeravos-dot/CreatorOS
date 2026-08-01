import { MarketExpansionEngineService } from './market-expansion-engine.service';

describe('MarketExpansionEngineService', () => {
  it('should expose the current service class', () => {
    expect(MarketExpansionEngineService).toBeDefined();
    expect(typeof MarketExpansionEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(MarketExpansionEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (MarketExpansionEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(MarketExpansionEngineService.name).toBe('MarketExpansionEngineService');
  });
});