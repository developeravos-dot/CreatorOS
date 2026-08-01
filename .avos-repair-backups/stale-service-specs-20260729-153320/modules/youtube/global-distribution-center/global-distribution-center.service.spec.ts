import { GlobalDistributionCenterService } from './global-distribution-center.service';

describe('GlobalDistributionCenterService', () => {
  it('should expose the current service class', () => {
    expect(GlobalDistributionCenterService).toBeDefined();
    expect(typeof GlobalDistributionCenterService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(GlobalDistributionCenterService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (GlobalDistributionCenterService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(GlobalDistributionCenterService.name).toBe('GlobalDistributionCenterService');
  });
});