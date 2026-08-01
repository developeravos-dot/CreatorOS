import { UnifiedMediaAnalyticsEngineService } from './unified-media-analytics-engine.service';

describe('UnifiedMediaAnalyticsEngineService', () => {
  it('exports the current service class', () => {
    expect(UnifiedMediaAnalyticsEngineService).toBeDefined();
    expect(typeof UnifiedMediaAnalyticsEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = UnifiedMediaAnalyticsEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(UnifiedMediaAnalyticsEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});