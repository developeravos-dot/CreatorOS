import {
  ComponentHealthCheckService,
} from './component-health-check.service';

describe(
  'ComponentHealthCheckService',
  () => {
    let service:
      ComponentHealthCheckService;

    beforeEach(() => {
      service =
        new ComponentHealthCheckService();
    });

    it(
      'returns successful component health results',
      async () => {
        const result =
          await service.run(
            {
              component:
                'database',
            },
            async () => ({
              status:
                'healthy',
              message:
                'Database is available.',
              details: {
                connected: true,
              },
            }),
          );

        expect(result).toEqual(
          expect.objectContaining({
            component:
              'database',
            status:
              'healthy',
            message:
              'Database is available.',
          }),
        );

        expect(
          result.latencyMs,
        ).toBeGreaterThanOrEqual(0);

        expect(
          result.details,
        ).toEqual({
          connected: true,
        });
      },
    );

    it(
      'isolates probe failures',
      async () => {
        const result =
          await service.run(
            {
              component:
                'runtime',
            },
            async () => {
              throw new Error(
                'Runtime inspection failed.',
              );
            },
          );

        expect(result.status).toBe(
          'unhealthy',
        );

        expect(result.message).toBe(
          'Runtime inspection failed.',
        );

        expect(result.details).toEqual(
          expect.objectContaining({
            failed: true,
            timedOut: false,
          }),
        );
      },
    );

    it(
      'returns a structured timeout result',
      async () => {
        const result =
          await service.run(
            {
              component:
                'plugin-host',
              timeoutMs: 10,
            },
            async () => {
              await new Promise<void>(
                (resolve) => {
                  setTimeout(
                    resolve,
                    50,
                  );
                },
              );

              return {
                status:
                  'healthy',
                message:
                  'Late result.',
              };
            },
          );

        expect(result.status).toBe(
          'unhealthy',
        );

        expect(result.details).toEqual(
          expect.objectContaining({
            failed: true,
            timedOut: true,
            timeoutMs: 10,
          }),
        );
      },
    );

    it(
      'supports a custom timeout status',
      async () => {
        const result =
          await service.run(
            {
              component:
                'optional-component',
              timeoutMs: 5,
              timeoutStatus:
                'unknown',
            },
            () =>
              new Promise(
                () => undefined,
              ),
          );

        expect(result.status).toBe(
          'unknown',
        );
      },
    );

    it(
      'sanitizes secrets and connection strings',
      async () => {
        const result =
          await service.run(
            {
              component:
                'database',
            },
            async () => {
              throw new Error(
                'DATABASE_URL=postgresql://admin:password@localhost:5432/creatoros TOKEN=secret-value',
              );
            },
          );

        expect(result.message).not
          .toContain(
            'admin:password',
          );

        expect(result.message).not
          .toContain(
            'secret-value',
          );

        expect(result.message).toContain(
          '[REDACTED',
        );
      },
    );

    it(
      'does not mutate previous results',
      async () => {
        const first =
          await service.run(
            {
              component:
                'registry',
            },
            async () => ({
              status:
                'healthy',
              message:
                'Registry healthy.',
              details: {
                count: 1,
              },
            }),
          );

        const second =
          await service.run(
            {
              component:
                'registry',
            },
            async () => ({
              status:
                'degraded',
              message:
                'Registry degraded.',
              details: {
                count: 2,
              },
            }),
          );

        expect(first.status).toBe(
          'healthy',
        );

        expect(first.details).toEqual({
          count: 1,
        });

        expect(second.status).toBe(
          'degraded',
        );

        expect(second.details).toEqual({
          count: 2,
        });
      },
    );
  },
);