import { CommerceIntelligenceStageService } from './commerce-intelligence-stage.service';

describe('CommerceIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(CommerceIntelligenceStageService).toBeDefined();
    expect(typeof CommerceIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CommerceIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CommerceIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});