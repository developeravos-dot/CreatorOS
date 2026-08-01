import { MultiPlatformDistributionStageService } from './multi-platform-distribution-stage.service';

describe('MultiPlatformDistributionStageService', () => {
  it('should expose the current service class', () => {
    expect(MultiPlatformDistributionStageService).toBeDefined();
    expect(typeof MultiPlatformDistributionStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(MultiPlatformDistributionStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (MultiPlatformDistributionStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(MultiPlatformDistributionStageService.name).toBe('MultiPlatformDistributionStageService');
  });
});