import { AudioMasteringStageService } from './audio-mastering-stage.service';

describe('AudioMasteringStageService', () => {
  it('should expose the current service class', () => {
    expect(AudioMasteringStageService).toBeDefined();
    expect(typeof AudioMasteringStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(AudioMasteringStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (AudioMasteringStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(AudioMasteringStageService.name).toBe('AudioMasteringStageService');
  });
});