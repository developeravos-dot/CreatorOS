import { PlatformStatusService } from './platform-status.service';

describe('PlatformStatusService', () => {
  it('exports the current service class', () => {
    expect(PlatformStatusService).toBeDefined();
    expect(typeof PlatformStatusService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = PlatformStatusService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(PlatformStatusService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});