import { RevenueStreamDesignStageService } from './revenue-stream-design-stage.service';

describe('RevenueStreamDesignStageService', () => {
  it('should expose the current service class', () => {
    expect(RevenueStreamDesignStageService).toBeDefined();
    expect(typeof RevenueStreamDesignStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(RevenueStreamDesignStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (RevenueStreamDesignStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(RevenueStreamDesignStageService.name).toBe('RevenueStreamDesignStageService');
  });
});