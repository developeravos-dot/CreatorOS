import { RevenueStreamDesignStageService } from './revenue-stream-design-stage.service';

describe('RevenueStreamDesignStageService', () => {
  it('exports the current service class', () => {
    expect(RevenueStreamDesignStageService).toBeDefined();
    expect(typeof RevenueStreamDesignStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = RevenueStreamDesignStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(RevenueStreamDesignStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});