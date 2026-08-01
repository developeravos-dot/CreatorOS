import { IdempotencyService } from './idempotency.service';

describe('IdempotencyService', () => {
  it('creates stable request hashes', () => {
    const service = new IdempotencyService({} as never);

    expect(service.hashBody({ a: 1 })).toBe(
      service.hashBody({ a: 1 }),
    );
  });
});