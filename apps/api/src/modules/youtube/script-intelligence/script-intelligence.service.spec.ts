import { ScriptIntelligenceService } from './script-intelligence.service';

describe('ScriptIntelligenceService', () => {
  it('exports the current service class', () => {
    expect(ScriptIntelligenceService).toBeDefined();
    expect(typeof ScriptIntelligenceService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ScriptIntelligenceService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ScriptIntelligenceService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});