import {
  JobRetryPolicyService,
  type JobRetryStrategy,
} from './job-retry-policy.service';
import {
  createDefaultJobRetryPolicy,
} from '../models';

describe(
  'JobRetryPolicyService',
  () => {
    let service:
      JobRetryPolicyService;

    const now =
      '2026-08-05T10:00:00.000Z';

    beforeEach(() => {
      service =
        new JobRetryPolicyService();
    });

    it(
      'registers canonical strategies',
      () => {
        expect(
          service.listStrategies(),
        ).toEqual([
          'exponential',
          'fixed',
          'linear',
          'none',
        ]);

        expect(
          service.hasStrategy(
            'exponential',
          ),
        ).toBe(true);
      },
    );

    it(
      'calculates fixed backoff',
      () => {
        const policy = {
          ...createDefaultJobRetryPolicy(),
          strategy:
            'fixed' as const,
          initialDelayMs:
            2_000,
        };

        expect(
          service.calculateDelay(
            policy,
            4,
          ),
        ).toBe(2_000);
      },
    );

    it(
      'calculates linear backoff',
      () => {
        const policy = {
          ...createDefaultJobRetryPolicy(),
          strategy:
            'linear' as const,
          initialDelayMs:
            1_000,
          multiplier: 2,
        };

        expect(
          service.calculateDelay(
            policy,
            3,
          ),
        ).toBe(6_000);
      },
    );

    it(
      'calculates exponential backoff',
      () => {
        const policy = {
          ...createDefaultJobRetryPolicy(),
          strategy:
            'exponential' as const,
          initialDelayMs:
            1_000,
          multiplier: 2,
        };

        expect(
          service.calculateDelay(
            policy,
            4,
          ),
        ).toBe(8_000);
      },
    );

    it(
      'caps calculated delays',
      () => {
        const policy = {
          ...createDefaultJobRetryPolicy(),
          initialDelayMs:
            10_000,
          maximumDelayMs:
            15_000,
        };

        expect(
          service.calculateDelay(
            policy,
            5,
          ),
        ).toBe(15_000);
      },
    );

    it(
      'applies deterministic jitter',
      () => {
        expect(
          service.applyJitter(
            1_000,
            0,
          ),
        ).toBe(500);

        expect(
          service.applyJitter(
            1_000,
            0.5,
          ),
        ).toBe(1_000);

        expect(
          service.applyJitter(
            1_000,
            1,
          ),
        ).toBe(1_500);
      },
    );

    it(
      'approves retryable failures',
      () => {
        const result =
          service.evaluate({
            attemptNumber: 1,
            failure: {
              kind:
                'infrastructure',
              message:
                'Network failed.',
              retryable: true,
              occurredAt: now,
            },
            policy:
              createDefaultJobRetryPolicy(),
            now,
          });

        expect(
          result.shouldRetry,
        ).toBe(true);

        expect(
          result.nextAttemptNumber,
        ).toBe(2);

        expect(
          result.delayMs,
        ).toBe(2_000);

        expect(
          result.retryAt,
        ).toBe(
          '2026-08-05T10:00:02.000Z',
        );
      },
    );

    it(
      'rejects non-retryable failures',
      () => {
        const result =
          service.evaluate({
            attemptNumber: 1,
            failure: {
              kind:
                'validation',
              message:
                'Invalid payload.',
              retryable: false,
              occurredAt: now,
            },
            now,
          });

        expect(
          result.shouldRetry,
        ).toBe(false);

        expect(result.reason)
          .toContain(
            'not retryable',
          );
      },
    );

    it(
      'rejects retries after maximum attempts',
      () => {
        const result =
          service.evaluate({
            attemptNumber: 3,
            failure: {
              kind:
                'execution',
              message:
                'Worker failed.',
              retryable: true,
              occurredAt: now,
            },
            policy:
              createDefaultJobRetryPolicy(),
            now,
          });

        expect(
          result.shouldRetry,
        ).toBe(false);

        expect(result.reason)
          .toContain(
            'Maximum',
          );
      },
    );

    it(
      'allows retry by error code override',
      () => {
        const policy = {
          ...createDefaultJobRetryPolicy(),
          retryableFailureKinds:
            [],
          retryableErrorCodes: [
            'TEMPORARY',
          ],
        };

        expect(
          service.isFailureRetryable(
            {
              kind:
                'validation',
              code:
                'TEMPORARY',
              message:
                'Temporary validation issue.',
              retryable: true,
              occurredAt: now,
            },
            policy,
          ),
        ).toBe(true);
      },
    );

    it(
      'classifies failures',
      () => {
        expect(
          service.classifyFailure({
            message:
              'Request timeout.',
          }).kind,
        ).toBe('timeout');

        expect(
          service.classifyFailure({
            message:
              'Too many requests.',
            code: '429',
          }).kind,
        ).toBe('rate_limit');

        expect(
          service.classifyFailure({
            message:
              'Invalid payload.',
          }).retryable,
        ).toBe(false);
      },
    );

    it(
      'sanitizes failure secrets',
      () => {
        const failure =
          service.classifyFailure({
            message:
              'TOKEN=secret-token',
            details: {
              password:
                'secret-password',
            },
          });

        const serialized =
          JSON.stringify(
            failure,
          );

        expect(serialized)
          .not.toContain(
            'secret-token',
          );

        expect(serialized)
          .not.toContain(
            'secret-password',
          );
      },
    );

    it(
      'supports custom strategy registration',
      () => {
        const strategy:
          JobRetryStrategy = {
            name: 'fixed',
            calculateDelay:
              () => 321,
          };

        service.registerStrategy(
          strategy,
        );

        expect(
          service.calculateDelay(
            {
              ...createDefaultJobRetryPolicy(),
              strategy: 'fixed',
            },
            1,
          ),
        ).toBe(321);
      },
    );

    it(
      'records retry metrics',
      () => {
        service.evaluate({
          attemptNumber: 1,
          failure: {
            kind:
              'infrastructure',
            message:
              'Network failed.',
            retryable: true,
            occurredAt: now,
          },
          now,
        });

        service.evaluate({
          attemptNumber: 1,
          failure: {
            kind:
              'validation',
            message:
              'Invalid.',
            retryable: false,
            occurredAt: now,
          },
          now,
        });

        const metrics =
          service.metrics();

        expect(
          metrics.evaluations,
        ).toBe(2);

        expect(
          metrics.retriesApproved,
        ).toBe(1);

        expect(
          metrics.retriesRejected,
        ).toBe(1);

        expect(
          metrics.failureKinds
            .infrastructure,
        ).toBe(1);

        expect(
          metrics.failureKinds
            .validation,
        ).toBe(1);
      },
    );
  },
);