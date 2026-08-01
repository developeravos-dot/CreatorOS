import { ScriptScreenplayIntelligenceService } from './script-screenplay-intelligence.service';

describe('ScriptScreenplayIntelligenceService', () => {
  it('exports the current service class', () => {
    expect(ScriptScreenplayIntelligenceService).toBeDefined();
    expect(typeof ScriptScreenplayIntelligenceService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ScriptScreenplayIntelligenceService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ScriptScreenplayIntelligenceService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});