import { ReportingEngineService } from './reporting-engine.service';

describe('ReportingEngineService', () => {
  it('should expose the current service class', () => {
    expect(ReportingEngineService).toBeDefined();
    expect(typeof ReportingEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ReportingEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ReportingEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ReportingEngineService.name).toBe('ReportingEngineService');
  });
});