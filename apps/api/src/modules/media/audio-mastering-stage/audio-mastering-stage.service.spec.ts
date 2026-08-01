import { AudioMasteringStageService } from './audio-mastering-stage.service';

describe('AudioMasteringStageService', () => {
  it('exports the current service class', () => {
    expect(AudioMasteringStageService).toBeDefined();
    expect(typeof AudioMasteringStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = AudioMasteringStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(AudioMasteringStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});