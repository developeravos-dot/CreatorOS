import { IpProductizationStageService } from './ip-productization-stage.service';

describe('IpProductizationStageService', () => {
  it('should expose the current service class', () => {
    expect(IpProductizationStageService).toBeDefined();
    expect(typeof IpProductizationStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(IpProductizationStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (IpProductizationStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(IpProductizationStageService.name).toBe('IpProductizationStageService');
  });
});