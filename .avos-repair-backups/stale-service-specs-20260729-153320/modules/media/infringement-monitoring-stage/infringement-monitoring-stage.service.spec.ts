import { InfringementMonitoringStageService } from './infringement-monitoring-stage.service';

describe('InfringementMonitoringStageService', () => {
  it('should expose the current service class', () => {
    expect(InfringementMonitoringStageService).toBeDefined();
    expect(typeof InfringementMonitoringStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(InfringementMonitoringStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (InfringementMonitoringStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(InfringementMonitoringStageService.name).toBe('InfringementMonitoringStageService');
  });
});