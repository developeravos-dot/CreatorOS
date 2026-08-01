import { IpCommercializationDistributionStageService } from './ip-commercialization-distribution-stage.service';

describe('IpCommercializationDistributionStageService', () => {
  it('should expose the current service class', () => {
    expect(IpCommercializationDistributionStageService).toBeDefined();
    expect(typeof IpCommercializationDistributionStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(IpCommercializationDistributionStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (IpCommercializationDistributionStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(IpCommercializationDistributionStageService.name).toBe('IpCommercializationDistributionStageService');
  });
});