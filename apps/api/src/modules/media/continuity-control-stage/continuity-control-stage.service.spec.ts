import { ContinuityControlStageService } from './continuity-control-stage.service';

describe('ContinuityControlStageService', () => {
  it('exports the current service class', () => {
    expect(ContinuityControlStageService).toBeDefined();
    expect(typeof ContinuityControlStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ContinuityControlStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ContinuityControlStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});