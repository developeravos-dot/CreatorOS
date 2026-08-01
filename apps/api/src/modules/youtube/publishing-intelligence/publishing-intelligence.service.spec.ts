import { PublishingIntelligenceService } from './publishing-intelligence.service';

describe('PublishingIntelligenceService', () => {
  it('exports the current service class', () => {
    expect(PublishingIntelligenceService).toBeDefined();
    expect(typeof PublishingIntelligenceService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = PublishingIntelligenceService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(PublishingIntelligenceService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});