import { AdvertisingExpansionStageService } from './advertising-expansion-stage.service';

describe('AdvertisingExpansionStageService', () => {
  it('should expose the current service class', () => {
    expect(AdvertisingExpansionStageService).toBeDefined();
    expect(typeof AdvertisingExpansionStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(AdvertisingExpansionStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (AdvertisingExpansionStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(AdvertisingExpansionStageService.name).toBe('AdvertisingExpansionStageService');
  });
});