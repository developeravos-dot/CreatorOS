import { BrandIntelligencePlatformService } from './brand-intelligence-platform.service';

describe('BrandIntelligencePlatformService', () => {
  it('exports the current service class', () => {
    expect(BrandIntelligencePlatformService).toBeDefined();
    expect(typeof BrandIntelligencePlatformService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = BrandIntelligencePlatformService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(BrandIntelligencePlatformService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});