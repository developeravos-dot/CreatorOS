import { MediaResearchService } from './media-research.service';

describe('MediaResearchService', () => {
  it('exports the current service class', () => {
    expect(MediaResearchService).toBeDefined();
    expect(typeof MediaResearchService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = MediaResearchService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(MediaResearchService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});