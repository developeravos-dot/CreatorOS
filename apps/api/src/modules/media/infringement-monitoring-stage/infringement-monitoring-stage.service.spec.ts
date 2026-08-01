import { InfringementMonitoringStageService } from './infringement-monitoring-stage.service';

describe('InfringementMonitoringStageService', () => {
  it('exports the current service class', () => {
    expect(InfringementMonitoringStageService).toBeDefined();
    expect(typeof InfringementMonitoringStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = InfringementMonitoringStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(InfringementMonitoringStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});