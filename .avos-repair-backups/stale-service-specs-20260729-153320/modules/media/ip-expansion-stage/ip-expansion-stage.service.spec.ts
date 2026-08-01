import { IpExpansionStageService } from './ip-expansion-stage.service';

describe('IpExpansionStageService', () => {
  it('should expose the current service class', () => {
    expect(IpExpansionStageService).toBeDefined();
    expect(typeof IpExpansionStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(IpExpansionStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (IpExpansionStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(IpExpansionStageService.name).toBe('IpExpansionStageService');
  });
});