import {
  ComponentHealthCheckService,
} from './component-health-check.service';
import {
  MonitoringDiagnosticsService,
} from './monitoring-diagnostics.service';
import {
  SystemMetricsService,
} from './system-metrics.service';

describe(
  'MonitoringDiagnosticsService',
  () => {
    function setup(
      options: {
        databaseStatus?: string;
        databaseThrows?: boolean;
        invalidRegistry?: boolean;
        failedRuntime?: boolean;
        failedPlugin?: boolean;
      } = {},
    ) {
      const persistence = {
        getHealth:
          jest.fn(async () => {
            if (
              options.databaseThrows
            ) {
              throw new Error(
                'Database inspection failed.',
              );
            }

            return {
              name:
                'CreatorOS Persistence',
              status:
                options.databaseStatus ??
                'healthy',
              provider:
                'PostgreSQL/Prisma',
            };
          }),
      };

      const registryRecords = [
        {
          state:
            options.invalidRegistry
              ? 'invalid'
              : 'registered',
          manifest: {
            id:
              'creatoros.capability.one',
          },
        },
      ];

      const runtimeInstances = [
        {
          status:
            options.failedRuntime
              ? 'failed'
              : 'running',
          lifecycleState:
            options.failedRuntime
              ? 'failed'
              : 'active',
        },
      ];

      const plugins = [
        {
          pluginKey:
            'creatoros.plugin.one',
          state:
            options.failedPlugin
              ? 'failed'
              : 'active',
          runtimeInstanceId:
            options.failedPlugin
              ? undefined
              : 'runtime-one',
        },
      ];

      const platform = {
        registry: {
          listRecords:
            jest.fn(
              async () =>
                registryRecords,
            ),
        },
        runtime: {
          listInstances:
            jest.fn(
              () =>
                runtimeInstances,
            ),
        },
        dependencyResolver: {},
        pluginHost: {
          listInstalled:
            jest.fn(
              async () =>
                plugins,
            ),
        },
      };

      const service =
        new MonitoringDiagnosticsService(
          persistence as never,
          platform as never,
          new ComponentHealthCheckService(),
          new SystemMetricsService(),
        );

      return {
        service,
        persistence,
        platform,
      };
    }

    it(
      'returns healthy liveness',
      async () => {
        const { service } =
          setup();

        const result =
          await service.liveness();

        expect(result.alive).toBe(
          true,
        );

        expect(result.status).toBe(
          'healthy',
        );

        expect(
          result.responsivenessMs,
        ).toBeGreaterThanOrEqual(0);
      },
    );

    it(
      'reports a healthy database',
      async () => {
        const { service } =
          setup();

        const result =
          await service
            .checkDatabase();

        expect(result.status).toBe(
          'healthy',
        );
      },
    );

    it(
      'reports an unhealthy database',
      async () => {
        const { service } =
          setup({
            databaseStatus:
              'unhealthy',
          });

        const result =
          await service
            .checkDatabase();

        expect(result.status).toBe(
          'unhealthy',
        );
      },
    );

    it(
      'isolates database exceptions',
      async () => {
        const { service } =
          setup({
            databaseThrows: true,
          });

        const result =
          await service
            .checkDatabase();

        expect(result.status).toBe(
          'unhealthy',
        );

        expect(result.message).toBe(
          'Database inspection failed.',
        );
      },
    );

    it(
      'degrades when registry records are invalid',
      async () => {
        const { service } =
          setup({
            invalidRegistry: true,
          });

        const result =
          await service
            .checkRegistry();

        expect(result.status).toBe(
          'degraded',
        );

        expect(
          result.details.invalid,
        ).toBe(1);
      },
    );

    it(
      'degrades when runtime instances have failed',
      async () => {
        const { service } =
          setup({
            failedRuntime: true,
          });

        const result =
          await service
            .checkRuntime();

        expect(result.status).toBe(
          'degraded',
        );

        expect(
          result.details.failed,
        ).toBe(1);
      },
    );

    it(
      'degrades when plugins have failed',
      async () => {
        const { service } =
          setup({
            failedPlugin: true,
          });

        const result =
          await service
            .checkPluginHost();

        expect(result.status).toBe(
          'degraded',
        );

        expect(
          result.details.failed,
        ).toBe(1);
      },
    );

    it(
      'reports dependency resolver availability without mutation',
      async () => {
        const {
          service,
          platform,
        } = setup();

        const result =
          await service
            .checkDependencyResolver();

        expect(result.status).toBe(
          'healthy',
        );

        expect(
          result.details.stateless,
        ).toBe(true);

        expect(
          platform.registry
            .listRecords,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      'returns ready when required components are healthy',
      async () => {
        const { service } =
          setup();

        const result =
          await service.readiness();

        expect(result.ready).toBe(
          true,
        );

        expect(result.status).toBe(
          'healthy',
        );

        expect(
          result.components,
        ).toHaveLength(5);
      },
    );

    it(
      'returns not ready when database is unhealthy',
      async () => {
        const { service } =
          setup({
            databaseStatus:
              'unhealthy',
          });

        const result =
          await service.readiness();

        expect(result.ready).toBe(
          false,
        );

        expect(result.status).toBe(
          'unhealthy',
        );
      },
    );

    it(
      'returns degraded health for noncritical degradation',
      async () => {
        const { service } =
          setup({
            failedPlugin: true,
          });

        const result =
          await service.health();

        expect(result.status).toBe(
          'degraded',
        );

        expect(
          result.counts.degraded,
        ).toBe(1);
      },
    );

    it(
      'returns unhealthy health for critical failures',
      async () => {
        const { service } =
          setup({
            databaseThrows: true,
          });

        const result =
          await service.health();

        expect(result.status).toBe(
          'unhealthy',
        );

        expect(
          result.counts.unhealthy,
        ).toBe(1);
      },
    );

    it(
      'does not mutate earlier health snapshots',
      async () => {
        const { service } =
          setup();

        const first =
          await service.health();

        const second =
          await service.health();

        expect(first).not.toBe(second);

        expect(first.components)
          .not.toBe(
            second.components,
          );

        expect(
          first.components[0],
        ).not.toBe(
          second.components[0],
        );
      },
    );

    it(
      'does not expose environment secrets',
      async () => {
        process.env.DATABASE_URL =
          'postgresql://admin:secret@localhost/database';

        try {
          const { service } =
            setup();

          const result =
            await service.health();

          const serialized =
            JSON.stringify(result);

          expect(serialized).not
            .toContain(
              'admin:secret',
            );

          expect(serialized).not
            .toContain(
              'DATABASE_URL',
            );
        } finally {
          delete process.env
            .DATABASE_URL;
        }
      },
    );
  },
);