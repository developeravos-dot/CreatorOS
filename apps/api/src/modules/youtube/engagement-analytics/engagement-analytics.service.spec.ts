import { EngagementAnalyticsService } from './engagement-analytics.service';

describe('EngagementAnalyticsService', () => {
  it('exports the current service class', () => {
    expect(EngagementAnalyticsService).toBeDefined();
    expect(typeof EngagementAnalyticsService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = EngagementAnalyticsService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(EngagementAnalyticsService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});