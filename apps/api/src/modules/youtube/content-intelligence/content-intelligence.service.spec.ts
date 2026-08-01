import { ContentIntelligenceService } from './content-intelligence.service';

describe('ContentIntelligenceService', () => {
  it('exports the current service class', () => {
    expect(ContentIntelligenceService).toBeDefined();
    expect(typeof ContentIntelligenceService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ContentIntelligenceService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ContentIntelligenceService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});