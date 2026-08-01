import { AnimationIntelligenceStageService } from './animation-intelligence-stage.service';

describe('AnimationIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(AnimationIntelligenceStageService).toBeDefined();
    expect(typeof AnimationIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(AnimationIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (AnimationIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(AnimationIntelligenceStageService.name).toBe('AnimationIntelligenceStageService');
  });
});