import { DomainService } from './domain.service';

describe('DomainService', () => {
  it('exports the current service class', () => {
    expect(DomainService).toBeDefined();
    expect(typeof DomainService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = DomainService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(DomainService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});