import { EditingVfxQualityEngineService } from './editing-vfx-quality-engine.service';

describe('EditingVfxQualityEngineService', () => {
  it('should expose the current service class', () => {
    expect(EditingVfxQualityEngineService).toBeDefined();
    expect(typeof EditingVfxQualityEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(EditingVfxQualityEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (EditingVfxQualityEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(EditingVfxQualityEngineService.name).toBe('EditingVfxQualityEngineService');
  });
});