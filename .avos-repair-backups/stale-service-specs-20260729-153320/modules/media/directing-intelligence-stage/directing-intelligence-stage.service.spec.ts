import { DirectingIntelligenceStageService } from './directing-intelligence-stage.service';

describe('DirectingIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(DirectingIntelligenceStageService).toBeDefined();
    expect(typeof DirectingIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(DirectingIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (DirectingIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(DirectingIntelligenceStageService.name).toBe('DirectingIntelligenceStageService');
  });
});