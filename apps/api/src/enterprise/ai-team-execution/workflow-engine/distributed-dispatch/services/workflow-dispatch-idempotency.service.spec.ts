import {
  WorkflowDispatchIdempotencyService,
} from './workflow-dispatch-idempotency.service';

describe('WorkflowDispatchIdempotencyService', () => {
  let service:
    WorkflowDispatchIdempotencyService;

  beforeEach(() => {
    service =
      new WorkflowDispatchIdempotencyService();
  });

  it('reserves unique keys', () => {
    expect(
      service.reserve(
        'workflow:execution-1',
        'dispatch-1',
      ),
    ).toBe(true);

    expect(
      service.reserve(
        'workflow:execution-1',
        'dispatch-2',
      ),
    ).toBe(false);
  });

  it('retrieves defensive entries', () => {
    service.reserve(
      'workflow:execution-1',
      'dispatch-1',
    );

    const entry = service.get(
      'workflow:execution-1',
    );

    expect(entry).toEqual(
      expect.objectContaining({
        key: 'workflow:execution-1',
        dispatchId: 'dispatch-1',
      }),
    );

    entry!.expiresAt.setFullYear(2000);

    expect(
      service.get(
        'workflow:execution-1',
      )?.expiresAt.getFullYear(),
    ).not.toBe(2000);
  });

  it('releases reserved keys', () => {
    service.reserve(
      'workflow:execution-1',
      'dispatch-1',
    );

    expect(
      service.release(
        'workflow:execution-1',
      ),
    ).toBe(true);

    expect(
      service.exists(
        'workflow:execution-1',
      ),
    ).toBe(false);
  });

  it('expires reserved keys', () => {
    jest.useFakeTimers();

    jest.setSystemTime(
      new Date('2026-08-04T00:00:00.000Z'),
    );

    service.reserve(
      'workflow:execution-1',
      'dispatch-1',
      1_000,
    );

    jest.setSystemTime(
      new Date('2026-08-04T00:00:01.001Z'),
    );

    expect(
      service.exists(
        'workflow:execution-1',
      ),
    ).toBe(false);

    jest.useRealTimers();
  });
});
