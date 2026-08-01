import { VideoProductionService } from './video-production.service';

describe('VideoProductionService', () => {
  it('exports the current service class', () => {
    expect(VideoProductionService).toBeDefined();
    expect(typeof VideoProductionService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = VideoProductionService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(VideoProductionService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});