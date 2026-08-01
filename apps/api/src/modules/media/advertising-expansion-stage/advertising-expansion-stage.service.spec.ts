import { AdvertisingExpansionStageService } from './advertising-expansion-stage.service';

describe('AdvertisingExpansionStageService', () => {
  it('exports the current service class', () => {
    expect(AdvertisingExpansionStageService).toBeDefined();
    expect(typeof AdvertisingExpansionStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = AdvertisingExpansionStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(AdvertisingExpansionStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});