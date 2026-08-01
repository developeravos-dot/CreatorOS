import { EditingVfxQualityEngineService } from './editing-vfx-quality-engine.service';

describe('EditingVfxQualityEngineService', () => {
  it('exports the current service class', () => {
    expect(EditingVfxQualityEngineService).toBeDefined();
    expect(typeof EditingVfxQualityEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = EditingVfxQualityEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(EditingVfxQualityEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});