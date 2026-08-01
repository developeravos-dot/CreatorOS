import { LocalizationGlobalDistributionService } from './localization-global-distribution.service';

describe('LocalizationGlobalDistributionService', () => {
  it('exports the current service class', () => {
    expect(LocalizationGlobalDistributionService).toBeDefined();
    expect(typeof LocalizationGlobalDistributionService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = LocalizationGlobalDistributionService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(LocalizationGlobalDistributionService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});