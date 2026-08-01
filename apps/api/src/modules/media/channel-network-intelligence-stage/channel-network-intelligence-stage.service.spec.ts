import { ChannelNetworkIntelligenceStageService } from './channel-network-intelligence-stage.service';

describe('ChannelNetworkIntelligenceStageService', () => {
  it('exports the current service class', () => {
    expect(ChannelNetworkIntelligenceStageService).toBeDefined();
    expect(typeof ChannelNetworkIntelligenceStageService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ChannelNetworkIntelligenceStageService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ChannelNetworkIntelligenceStageService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});