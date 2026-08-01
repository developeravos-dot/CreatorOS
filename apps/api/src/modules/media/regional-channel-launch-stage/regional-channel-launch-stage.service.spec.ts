import { RegionalChannelLaunchStageService } from './regional-channel-launch-stage.service';

describe('RegionalChannelLaunchStageService', () => {
  it('exports the current service class', () => {
    expect(RegionalChannelLaunchStageService).toBeDefined();
    expect(typeof RegionalChannelLaunchStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = RegionalChannelLaunchStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(RegionalChannelLaunchStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});