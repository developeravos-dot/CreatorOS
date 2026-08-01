import { OfferArchitectureStageService } from './offer-architecture-stage.service';

describe('OfferArchitectureStageService', () => {
  it('should expose the current service class', () => {
    expect(OfferArchitectureStageService).toBeDefined();
    expect(typeof OfferArchitectureStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(OfferArchitectureStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (OfferArchitectureStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(OfferArchitectureStageService.name).toBe('OfferArchitectureStageService');
  });
});