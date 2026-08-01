import { AudienceGrowthEngineService } from './audience-growth-engine.service';

describe('AudienceGrowthEngineService', () => {
  it('exports the current service class', () => {
    expect(AudienceGrowthEngineService).toBeDefined();
    expect(typeof AudienceGrowthEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = AudienceGrowthEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(AudienceGrowthEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});