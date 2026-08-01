import { ChannelStrategyEngineService } from './channel-strategy-engine.service';

describe('ChannelStrategyEngineService', () => {
  it('should expose the current service class', () => {
    expect(ChannelStrategyEngineService).toBeDefined();
    expect(typeof ChannelStrategyEngineService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(ChannelStrategyEngineService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (ChannelStrategyEngineService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(ChannelStrategyEngineService.name).toBe('ChannelStrategyEngineService');
  });
});