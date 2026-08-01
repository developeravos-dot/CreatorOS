import { SubscriberGrowthEngineService } from './subscriber-growth-engine.service';

describe('SubscriberGrowthEngineService', () => {
  it('exports the current service class', () => {
    expect(SubscriberGrowthEngineService).toBeDefined();
    expect(typeof SubscriberGrowthEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = SubscriberGrowthEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(SubscriberGrowthEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});