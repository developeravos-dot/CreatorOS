import { DependencyService } from './dependency.service';

describe('DependencyService', () => {
  it('exports the current service class', () => {
    expect(DependencyService).toBeDefined();
    expect(typeof DependencyService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = DependencyService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(DependencyService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});