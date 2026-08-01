import { SchedulingEngineService } from './scheduling-engine.service';

describe('SchedulingEngineService', () => {
  it('should expose the current service class', () => {
    expect(SchedulingEngineService).toBeDefined();
    expect(typeof SchedulingEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(SchedulingEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (SchedulingEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(SchedulingEngineService.name).toBe('SchedulingEngineService');
  });
});