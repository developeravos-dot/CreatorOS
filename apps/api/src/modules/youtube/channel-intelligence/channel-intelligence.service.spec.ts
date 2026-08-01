import { ChannelIntelligenceService } from './channel-intelligence.service';

describe('ChannelIntelligenceService', () => {
  it('exports the current service class', () => {
    expect(ChannelIntelligenceService).toBeDefined();
    expect(typeof ChannelIntelligenceService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ChannelIntelligenceService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ChannelIntelligenceService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});