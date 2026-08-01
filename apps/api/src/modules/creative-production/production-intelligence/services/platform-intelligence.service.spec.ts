import { PlatformIntelligenceService } from './platform-intelligence.service';

describe('PlatformIntelligenceService', () => {
  it('exports the current service class', () => {
    expect(PlatformIntelligenceService).toBeDefined();
    expect(typeof PlatformIntelligenceService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = PlatformIntelligenceService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(PlatformIntelligenceService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});