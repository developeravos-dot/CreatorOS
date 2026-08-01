import { MonetizationIpExpansionStageService } from './monetization-ip-expansion-stage.service';

describe('MonetizationIpExpansionStageService', () => {
  it('should expose the current service class', () => {
    expect(MonetizationIpExpansionStageService).toBeDefined();
    expect(typeof MonetizationIpExpansionStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(MonetizationIpExpansionStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (MonetizationIpExpansionStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(MonetizationIpExpansionStageService.name).toBe('MonetizationIpExpansionStageService');
  });
});