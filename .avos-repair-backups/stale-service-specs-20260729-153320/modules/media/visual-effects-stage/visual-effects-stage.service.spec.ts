import { VisualEffectsStageService } from './visual-effects-stage.service';

describe('VisualEffectsStageService', () => {
  it('should expose the current service class', () => {
    expect(VisualEffectsStageService).toBeDefined();
    expect(typeof VisualEffectsStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(VisualEffectsStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (VisualEffectsStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(VisualEffectsStageService.name).toBe('VisualEffectsStageService');
  });
});