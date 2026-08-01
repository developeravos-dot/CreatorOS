import { CreativeTemplateEngineStageService } from './creative-template-engine-stage.service';

describe('CreativeTemplateEngineStageService', () => {
  it('exports the current service class', () => {
    expect(CreativeTemplateEngineStageService).toBeDefined();
    expect(typeof CreativeTemplateEngineStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CreativeTemplateEngineStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CreativeTemplateEngineStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});