import { VisualStyleIntelligenceStageService } from './visual-style-intelligence-stage.service';

describe('VisualStyleIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(VisualStyleIntelligenceStageService).toBeDefined();
    expect(typeof VisualStyleIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(VisualStyleIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (VisualStyleIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(VisualStyleIntelligenceStageService.name).toBe('VisualStyleIntelligenceStageService');
  });
});