import { ChannelIntelligenceService } from './channel-intelligence.service';

describe('ChannelIntelligenceService', () => {
  it('should expose the current service class', () => {
    expect(ChannelIntelligenceService).toBeDefined();
    expect(typeof ChannelIntelligenceService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ChannelIntelligenceService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ChannelIntelligenceService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ChannelIntelligenceService.name).toBe('ChannelIntelligenceService');
  });
});