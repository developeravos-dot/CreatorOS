import { PlatformAdaptationStageService } from './platform-adaptation-stage.service';

describe('PlatformAdaptationStageService', () => {
  it('should expose the current service class', () => {
    expect(PlatformAdaptationStageService).toBeDefined();
    expect(typeof PlatformAdaptationStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(PlatformAdaptationStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (PlatformAdaptationStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(PlatformAdaptationStageService.name).toBe('PlatformAdaptationStageService');
  });
});