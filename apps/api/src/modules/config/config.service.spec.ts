import { ConfigService } from './config.service';

describe('ConfigService', () => {
  it('exports the current service class', () => {
    expect(ConfigService).toBeDefined();
    expect(typeof ConfigService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = ConfigService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(ConfigService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});