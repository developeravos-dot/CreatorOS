import { ScriptScreenplayIntelligenceService } from './script-screenplay-intelligence.service';

describe('ScriptScreenplayIntelligenceService', () => {
  it('should expose the current service class', () => {
    expect(ScriptScreenplayIntelligenceService).toBeDefined();
    expect(typeof ScriptScreenplayIntelligenceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ScriptScreenplayIntelligenceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ScriptScreenplayIntelligenceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ScriptScreenplayIntelligenceService.name).toBe('ScriptScreenplayIntelligenceService');
  });
});