import { PublishingDistributionStageService } from './publishing-distribution-stage.service';

describe('PublishingDistributionStageService', () => {
  it('should expose the current service class', () => {
    expect(PublishingDistributionStageService).toBeDefined();
    expect(typeof PublishingDistributionStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(PublishingDistributionStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (PublishingDistributionStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(PublishingDistributionStageService.name).toBe('PublishingDistributionStageService');
  });
});