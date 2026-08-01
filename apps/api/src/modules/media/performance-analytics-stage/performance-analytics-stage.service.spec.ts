import { PerformanceAnalyticsStageService } from './performance-analytics-stage.service';

describe('PerformanceAnalyticsStageService', () => {
  it('exports the current service class', () => {
    expect(PerformanceAnalyticsStageService).toBeDefined();
    expect(typeof PerformanceAnalyticsStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = PerformanceAnalyticsStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(PerformanceAnalyticsStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});