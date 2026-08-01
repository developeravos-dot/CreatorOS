import { TrendForecastingStageService } from './trend-forecasting-stage.service';

describe('TrendForecastingStageService', () => {
  it('should expose the current service class', () => {
    expect(TrendForecastingStageService).toBeDefined();
    expect(typeof TrendForecastingStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(TrendForecastingStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (TrendForecastingStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(TrendForecastingStageService.name).toBe('TrendForecastingStageService');
  });
});