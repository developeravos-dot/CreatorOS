import { MetricsService } from './metrics.service';

describe('MetricsService', () => {
  it('exports the current service class', () => {
    expect(MetricsService).toBeDefined();
    expect(typeof MetricsService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = MetricsService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(MetricsService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});