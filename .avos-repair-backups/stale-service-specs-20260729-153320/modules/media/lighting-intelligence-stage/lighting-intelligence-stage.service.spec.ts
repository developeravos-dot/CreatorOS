import { LightingIntelligenceStageService } from './lighting-intelligence-stage.service';

describe('LightingIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(LightingIntelligenceStageService).toBeDefined();
    expect(typeof LightingIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(LightingIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (LightingIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(LightingIntelligenceStageService.name).toBe('LightingIntelligenceStageService');
  });
});