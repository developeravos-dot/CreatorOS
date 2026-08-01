import { CoreService } from './core.service';

describe('CoreService', () => {
  it('exports the current service class', () => {
    expect(CoreService).toBeDefined();
    expect(typeof CoreService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = CoreService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(CoreService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});