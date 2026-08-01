import { ProtectabilityAnalysisStageService } from './protectability-analysis-stage.service';

describe('ProtectabilityAnalysisStageService', () => {
  it('exports the current service class', () => {
    expect(ProtectabilityAnalysisStageService).toBeDefined();
    expect(typeof ProtectabilityAnalysisStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ProtectabilityAnalysisStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ProtectabilityAnalysisStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});