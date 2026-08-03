import {
  DiagnosticsService,
} from './diagnostics.service';

describe(
  'DiagnosticsService',
  () => {
    function component(
      name: string,
      status:
        | 'healthy'
        | 'degraded'
        | 'unhealthy'
        | 'unknown',
    ) {
      return {
        component:
          name,
        status,
        message:
          `${name} is ${status}.`,
        latencyMs: 2,
        checkedAt:
          new Date().toISOString(),
        details: {
          sample: true,
        },
      };
    }

    it(
      'returns no issues for healthy systems',
      async () => {
        const service =
          new DiagnosticsService(
            {
              health:
                jest.fn(
                  async () => ({
                    status:
                      'healthy',
                    components: [
                      component(
                        'database',
                        'healthy',
                      ),
                    ],
                  }),
                ),
            } as never,
          );

        const result =
          await service
            .getDiagnostics();

        expect(result.status).toBe(
          'healthy',
        );

        expect(result.issues).toEqual(
          [],
        );

        expect(
          result.recommendations,
        ).toEqual([]);
      },
    );

    it(
      'creates issues and recommendations from degraded components',
      async () => {
        const service =
          new DiagnosticsService(
            {
              health:
                jest.fn(
                  async () => ({
                    status:
                      'degraded',
                    components: [
                      component(
                        'plugin-host',
                        'degraded',
                      ),
                    ],
                  }),
                ),
            } as never,
          );

        const result =
          await service
            .getDiagnostics();

        expect(result.issues).toHaveLength(
          1,
        );

        expect(
          result.issues[0]
            ?.severity,
        ).toBe('warning');

        expect(
          result.recommendations[0]
            ?.action,
        ).toContain(
          'failed plugins',
        );
      },
    );

    it(
      'marks database failures as critical',
      async () => {
        const service =
          new DiagnosticsService(
            {
              health:
                jest.fn(
                  async () => ({
                    status:
                      'unhealthy',
                    components: [
                      component(
                        'database',
                        'unhealthy',
                      ),
                    ],
                  }),
                ),
            } as never,
          );

        const result =
          await service
            .getDiagnostics();

        expect(
          result.issues[0]
            ?.severity,
        ).toBe('critical');

        expect(
          result.recommendations[0]
            ?.action,
        ).toContain(
          'database connectivity',
        );
      },
    );
  },
);