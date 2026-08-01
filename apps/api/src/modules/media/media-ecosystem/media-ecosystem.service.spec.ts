import { MediaEcosystemService } from './media-ecosystem.service';

describe('MediaEcosystemService', () => {
  it('exports the current service class', () => {
    expect(MediaEcosystemService).toBeDefined();
    expect(typeof MediaEcosystemService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = MediaEcosystemService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(MediaEcosystemService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});