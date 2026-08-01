import { ChannelNetworkIntelligenceStageService } from './channel-network-intelligence-stage.service';

describe('ChannelNetworkIntelligenceStageService', () => {
  it('should expose the current service class', () => {
    expect(ChannelNetworkIntelligenceStageService).toBeDefined();
    expect(typeof ChannelNetworkIntelligenceStageService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ChannelNetworkIntelligenceStageService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ChannelNetworkIntelligenceStageService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ChannelNetworkIntelligenceStageService.name).toBe('ChannelNetworkIntelligenceStageService');
  });
});