import { SoundDesignStageService } from './sound-design-stage.service';

describe('SoundDesignStageService', () => {
  it('should expose the current service class', () => {
    expect(SoundDesignStageService).toBeDefined();
    expect(typeof SoundDesignStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(SoundDesignStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (SoundDesignStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(SoundDesignStageService.name).toBe('SoundDesignStageService');
  });
});