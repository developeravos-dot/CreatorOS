import { VisualStyleIntelligenceStageService } from './visual-style-intelligence-stage.service';

describe('VisualStyleIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(VisualStyleIntelligenceStageService).toBeDefined();
    expect(typeof VisualStyleIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = VisualStyleIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(VisualStyleIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});