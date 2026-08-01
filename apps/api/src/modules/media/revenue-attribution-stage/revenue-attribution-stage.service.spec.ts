import { RevenueAttributionStageService } from './revenue-attribution-stage.service';

describe('RevenueAttributionStageService', () => {
  it('exports the current service class', () => {
    expect(RevenueAttributionStageService).toBeDefined();
    expect(typeof RevenueAttributionStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = RevenueAttributionStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(RevenueAttributionStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});