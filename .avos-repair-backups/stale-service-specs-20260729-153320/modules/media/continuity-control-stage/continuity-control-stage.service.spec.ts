import { ContinuityControlStageService } from './continuity-control-stage.service';

describe('ContinuityControlStageService', () => {
  it('should expose the current service class', () => {
    expect(ContinuityControlStageService).toBeDefined();
    expect(typeof ContinuityControlStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ContinuityControlStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ContinuityControlStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ContinuityControlStageService.name).toBe('ContinuityControlStageService');
  });
});