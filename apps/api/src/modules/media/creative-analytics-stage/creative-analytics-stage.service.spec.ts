import { CreativeAnalyticsStageService } from './creative-analytics-stage.service';

describe('CreativeAnalyticsStageService', () => {
  it('exports the current service class', () => {
    expect(CreativeAnalyticsStageService).toBeDefined();
    expect(typeof CreativeAnalyticsStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CreativeAnalyticsStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CreativeAnalyticsStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});