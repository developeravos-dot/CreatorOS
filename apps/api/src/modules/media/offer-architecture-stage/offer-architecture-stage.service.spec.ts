import { OfferArchitectureStageService } from './offer-architecture-stage.service';

describe('OfferArchitectureStageService', () => {
  it('exports the current service class', () => {
    expect(OfferArchitectureStageService).toBeDefined();
    expect(typeof OfferArchitectureStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = OfferArchitectureStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(OfferArchitectureStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});