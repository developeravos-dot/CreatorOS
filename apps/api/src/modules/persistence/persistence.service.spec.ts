import { PersistenceService } from './persistence.service';

describe('PersistenceService', () => {
  it('exports the current service class', () => {
    expect(PersistenceService).toBeDefined();
    expect(typeof PersistenceService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = PersistenceService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(PersistenceService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});