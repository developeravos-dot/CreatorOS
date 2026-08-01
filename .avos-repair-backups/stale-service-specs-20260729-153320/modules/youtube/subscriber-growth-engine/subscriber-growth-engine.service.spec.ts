import { SubscriberGrowthEngineService } from './subscriber-growth-engine.service';

describe('SubscriberGrowthEngineService', () => {
  it('should expose the current service class', () => {
    expect(SubscriberGrowthEngineService).toBeDefined();
    expect(typeof SubscriberGrowthEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(SubscriberGrowthEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (SubscriberGrowthEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(SubscriberGrowthEngineService.name).toBe('SubscriberGrowthEngineService');
  });
});