import { RetentionIntelligenceStageService } from './retention-intelligence-stage.service';

describe('RetentionIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(RetentionIntelligenceStageService).toBeDefined();
    expect(typeof RetentionIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = RetentionIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(RetentionIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});