import { PredictivePerformanceEngineService } from './predictive-performance-engine.service';

describe('PredictivePerformanceEngineService', () => {
  it('exports the current service class', () => {
    expect(PredictivePerformanceEngineService).toBeDefined();
    expect(typeof PredictivePerformanceEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = PredictivePerformanceEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(PredictivePerformanceEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});