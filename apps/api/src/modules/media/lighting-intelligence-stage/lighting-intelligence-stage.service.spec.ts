import { LightingIntelligenceStageService } from './lighting-intelligence-stage.service';

describe('LightingIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(LightingIntelligenceStageService).toBeDefined();
    expect(typeof LightingIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = LightingIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(LightingIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});