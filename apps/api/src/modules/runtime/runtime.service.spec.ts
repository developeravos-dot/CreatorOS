import { RuntimeService } from './runtime.service';

describe('RuntimeService', () => {
  it('exports the current service class', () => {
    expect(RuntimeService).toBeDefined();
    expect(typeof RuntimeService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = RuntimeService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(RuntimeService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});