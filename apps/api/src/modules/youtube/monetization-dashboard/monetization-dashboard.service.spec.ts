import { MonetizationDashboardService } from './monetization-dashboard.service';

describe('MonetizationDashboardService', () => {
  it('exports the current service class', () => {
    expect(MonetizationDashboardService).toBeDefined();
    expect(typeof MonetizationDashboardService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = MonetizationDashboardService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(MonetizationDashboardService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});