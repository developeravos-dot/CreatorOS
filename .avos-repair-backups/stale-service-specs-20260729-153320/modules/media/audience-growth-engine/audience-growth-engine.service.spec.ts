import { AudienceGrowthEngineService } from './audience-growth-engine.service';

describe('AudienceGrowthEngineService', () => {
  it('should expose the current service class', () => {
    expect(AudienceGrowthEngineService).toBeDefined();
    expect(typeof AudienceGrowthEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(AudienceGrowthEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (AudienceGrowthEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(AudienceGrowthEngineService.name).toBe('AudienceGrowthEngineService');
  });
});