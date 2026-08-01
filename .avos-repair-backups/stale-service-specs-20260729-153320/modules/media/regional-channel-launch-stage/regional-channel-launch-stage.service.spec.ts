import { RegionalChannelLaunchStageService } from './regional-channel-launch-stage.service';

describe('RegionalChannelLaunchStageService', () => {
  it('should expose the current service class', () => {
    expect(RegionalChannelLaunchStageService).toBeDefined();
    expect(typeof RegionalChannelLaunchStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(RegionalChannelLaunchStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (RegionalChannelLaunchStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(RegionalChannelLaunchStageService.name).toBe('RegionalChannelLaunchStageService');
  });
});