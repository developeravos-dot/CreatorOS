import { ReleasePerformanceIntelligenceService } from './release-performance-intelligence.service';

describe('ReleasePerformanceIntelligenceService', () => {
  it('exports the current service class', () => {
    expect(ReleasePerformanceIntelligenceService).toBeDefined();
    expect(typeof ReleasePerformanceIntelligenceService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ReleasePerformanceIntelligenceService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ReleasePerformanceIntelligenceService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});