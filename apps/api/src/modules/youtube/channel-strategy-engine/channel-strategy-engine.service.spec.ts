import { ChannelStrategyEngineService } from './channel-strategy-engine.service';

describe('ChannelStrategyEngineService', () => {
  it('exports the current service class', () => {
    expect(ChannelStrategyEngineService).toBeDefined();
    expect(typeof ChannelStrategyEngineService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ChannelStrategyEngineService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ChannelStrategyEngineService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});