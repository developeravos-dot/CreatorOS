import { ScriptIntelligenceStageService } from './script-intelligence-stage.service';

describe('ScriptIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(ScriptIntelligenceStageService).toBeDefined();
    expect(typeof ScriptIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ScriptIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ScriptIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ScriptIntelligenceStageService.name).toBe('ScriptIntelligenceStageService');
  });
});