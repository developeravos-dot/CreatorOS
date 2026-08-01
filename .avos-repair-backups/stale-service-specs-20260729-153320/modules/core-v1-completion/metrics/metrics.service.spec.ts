import { MetricsService } from './metrics.service';

describe('MetricsService', () => {
  it('should expose the current service class', () => {
    expect(MetricsService).toBeDefined();
    expect(typeof MetricsService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(MetricsService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (MetricsService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(MetricsService.name).toBe('MetricsService');
  });
});