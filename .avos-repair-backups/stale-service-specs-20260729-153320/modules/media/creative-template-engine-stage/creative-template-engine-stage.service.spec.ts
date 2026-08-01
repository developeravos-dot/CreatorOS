import { CreativeTemplateEngineStageService } from './creative-template-engine-stage.service';

describe('CreativeTemplateEngineStageService', () => {
  it('should expose the current service class', () => {
    expect(CreativeTemplateEngineStageService).toBeDefined();
    expect(typeof CreativeTemplateEngineStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(CreativeTemplateEngineStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (CreativeTemplateEngineStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(CreativeTemplateEngineStageService.name).toBe('CreativeTemplateEngineStageService');
  });
});