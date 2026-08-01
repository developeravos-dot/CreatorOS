import { VisualIdentityStageService } from './visual-identity-stage.service';

describe('VisualIdentityStageService', () => {
  it('should expose the current service class', () => {
    expect(VisualIdentityStageService).toBeDefined();
    expect(typeof VisualIdentityStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(VisualIdentityStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (VisualIdentityStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(VisualIdentityStageService.name).toBe('VisualIdentityStageService');
  });
});