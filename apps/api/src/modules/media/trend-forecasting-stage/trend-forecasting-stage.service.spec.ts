import { TrendForecastingStageService } from './trend-forecasting-stage.service';

describe('TrendForecastingStageService', () => {
  it('exports the current service class', () => {
    expect(TrendForecastingStageService).toBeDefined();
    expect(typeof TrendForecastingStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = TrendForecastingStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(TrendForecastingStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});