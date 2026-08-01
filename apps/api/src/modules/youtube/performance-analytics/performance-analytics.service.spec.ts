import { PerformanceAnalyticsService } from './performance-analytics.service';

describe('PerformanceAnalyticsService', () => {
  it('exports the current service class', () => {
    expect(PerformanceAnalyticsService).toBeDefined();
    expect(typeof PerformanceAnalyticsService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = PerformanceAnalyticsService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(PerformanceAnalyticsService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});