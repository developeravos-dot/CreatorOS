import { AnimationIntelligenceStageService } from './animation-intelligence-stage.service';

describe('AnimationIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(AnimationIntelligenceStageService).toBeDefined();
    expect(typeof AnimationIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = AnimationIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(AnimationIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});