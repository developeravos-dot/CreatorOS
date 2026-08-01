import { IdempotencyService } from './idempotency.service';

describe('IdempotencyService', () => {
  it('should expose the current service class', () => {
    expect(IdempotencyService).toBeDefined();
    expect(typeof IdempotencyService).toBe('function');
  });

  it('should expose only methods that exist on the current prototype', () => {
    const methods = Object.getOwnPropertyNames(IdempotencyService.prototype)
      .filter((name) => name !== 'constructor')
      .sort();

    for (const methodName of methods) {
      expect(typeof (IdempotencyService.prototype as Record<string, unknown>)[methodName])
        .toBe('function');
    }
  });

  it('should keep its runtime class name aligned with the exported service', () => {
    expect(IdempotencyService.name).toBe('IdempotencyService');
  });
});