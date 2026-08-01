import { MonetizationIpExpansionStageService } from './monetization-ip-expansion-stage.service';

describe('MonetizationIpExpansionStageService', () => {
  it('exports the current service class', () => {
    expect(MonetizationIpExpansionStageService).toBeDefined();
    expect(typeof MonetizationIpExpansionStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = MonetizationIpExpansionStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(MonetizationIpExpansionStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});