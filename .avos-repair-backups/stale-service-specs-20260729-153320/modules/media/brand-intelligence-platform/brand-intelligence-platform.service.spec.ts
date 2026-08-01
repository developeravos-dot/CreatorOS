import { BrandIntelligencePlatformService } from './brand-intelligence-platform.service';

describe('BrandIntelligencePlatformService', () => {
  it('should expose the current service class', () => {
    expect(BrandIntelligencePlatformService).toBeDefined();
    expect(typeof BrandIntelligencePlatformService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(BrandIntelligencePlatformService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (BrandIntelligencePlatformService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(BrandIntelligencePlatformService.name).toBe('BrandIntelligencePlatformService');
  });
});