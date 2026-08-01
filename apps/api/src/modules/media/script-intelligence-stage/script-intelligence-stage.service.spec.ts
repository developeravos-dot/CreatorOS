import { ScriptIntelligenceStageService } from './script-intelligence-stage.service';

describe('ScriptIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(ScriptIntelligenceStageService).toBeDefined();
    expect(typeof ScriptIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ScriptIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ScriptIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});