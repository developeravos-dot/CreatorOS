import {
  MonitoringMetricsService,
} from './monitoring-metrics.service';

describe(
  'MonitoringMetricsService',
  () => {
    function healthResult(
      component: string,
      details:
        Record<string, unknown>,
    ) {
      return {
        component,
        status:
          'healthy' as
            | 'healthy'
            | 'degraded'
            | 'unhealthy'
            | 'unknown',
        message:
          'Healthy.',
        latencyMs: 1,
        checkedAt:
          new Date().toISOString(),
        details,
      };
    }

    it(
      'aggregates process and platform metrics',
      async () => {
        const service =
          new MonitoringMetricsService(
            {
              checkDatabase:
                jest.fn(
                  async () =>
                    healthResult(
                      'database',
                      {},
                    ),
                ),

              checkRegistry:
                jest.fn(
                  async () =>
                    healthResult(
                      'capability-registry',
                      {
                        total: 3,
                        valid: 2,
                        invalid: 1,
                        states: {
                          registered: 2,
                          invalid: 1,
                        },
                      },
                    ),
                ),

              checkRuntime:
                jest.fn(
                  async () =>
                    healthResult(
                      'capability-runtime',
                      {
                        total: 2,
                        running: 1,
                        stopped: 1,
                        failed: 0,
                        transitional: 0,
                        states: {
                          running: 1,
                          stopped: 1,
                        },
                      },
                    ),
                ),

              checkDependencyResolver:
                jest.fn(
                  async () =>
                    healthResult(
                      'dependency-resolver',
                      {
                        available: true,
                        stateless: true,
                      },
                    ),
                ),

              checkPluginHost:
                jest.fn(
                  async () =>
                    healthResult(
                      'plugin-host',
                      {
                        total: 2,
                        active: 1,
                        inactive: 0,
                        installed: 1,
                        failed: 0,
                        withRuntimeInstance: 1,
                        states: {
                          active: 1,
                          installed: 1,
                        },
                      },
                    ),
                ),
            } as never,
            {
              getProcessMetrics:
                jest.fn(
                  async () => ({
                    processId:
                      process.pid,
                  }),
                ),
            } as never,
          );

        const result =
          await service.getMetrics();

        expect(
          result.registry?.total,
        ).toBe(3);

        expect(
          result.registry?.invalid,
        ).toBe(1);

        expect(
          result.runtime?.running,
        ).toBe(1);

        expect(
          result.pluginHost
            ?.active,
        ).toBe(1);

        expect(
          result.dependencyResolver
            ?.stateless,
        ).toBe(true);
      },
    );

    it(
      'normalizes malformed metric details safely',
      async () => {
        const empty =
          healthResult(
            'component',
            {
              total:
                'not-a-number',
              states:
                'invalid',
            },
          );

        const service =
          new MonitoringMetricsService(
            {
              checkDatabase:
                jest.fn(
                  async () =>
                    empty,
                ),
              checkRegistry:
                jest.fn(
                  async () =>
                    empty,
                ),
              checkRuntime:
                jest.fn(
                  async () =>
                    empty,
                ),
              checkDependencyResolver:
                jest.fn(
                  async () =>
                    empty,
                ),
              checkPluginHost:
                jest.fn(
                  async () =>
                    empty,
                ),
            } as never,
            {
              getProcessMetrics:
                jest.fn(
                  async () => ({
                    processId:
                      process.pid,
                  }),
                ),
            } as never,
          );

        const result =
          await service.getMetrics();

        expect(
          result.registry?.total,
        ).toBe(0);

        expect(
          result.registry?.states,
        ).toEqual({});
      },
    );
  },
);