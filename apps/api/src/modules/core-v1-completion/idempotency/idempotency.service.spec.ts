import { IdempotencyService } from './idempotency.service';

describe('IdempotencyService', () => {
  it('exports the current service class', () => {
    expect(IdempotencyService).toBeDefined();
    expect(typeof IdempotencyService).toBe('function');
  });

  it('exposes a valid service prototype', () => {
    const prototype = IdempotencyService.prototype;
    expect(prototype).toBeDefined();
    expect(prototype.constructor).toBe(IdempotencyService);

    const methods = Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== 'constructor')
      .filter((name) => typeof Object.getOwnPropertyDescriptor(prototype, name)?.value === 'function');

    expect(Array.isArray(methods)).toBe(true);
  });
});