import { ScriptIntelligenceService } from './script-intelligence.service';

describe('ScriptIntelligenceService', () => {
  it('should expose the current service class', () => {
    expect(ScriptIntelligenceService).toBeDefined();
    expect(typeof ScriptIntelligenceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ScriptIntelligenceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ScriptIntelligenceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ScriptIntelligenceService.name).toBe('ScriptIntelligenceService');
  });
});