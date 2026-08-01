import { DirectingIntelligenceStageService } from './directing-intelligence-stage.service';

describe('DirectingIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(DirectingIntelligenceStageService).toBeDefined();
    expect(typeof DirectingIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = DirectingIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(DirectingIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});