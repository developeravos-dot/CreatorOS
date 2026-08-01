import { VisualIdentityStageService } from './visual-identity-stage.service';

describe('VisualIdentityStageService', () => {
  it('exports the current service class', () => {
    expect(VisualIdentityStageService).toBeDefined();
    expect(typeof VisualIdentityStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = VisualIdentityStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(VisualIdentityStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});