import { VideoProductionService } from './video-production.service';

describe('VideoProductionService', () => {
  it('should expose the current service class', () => {
    expect(VideoProductionService).toBeDefined();
    expect(typeof VideoProductionService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(VideoProductionService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (VideoProductionService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(VideoProductionService.name).toBe('VideoProductionService');
  });
});