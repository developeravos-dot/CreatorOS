import {
  CapabilityPlatformAuditService,
} from './capability-platform-audit.service';
import {
  CapabilityRuntimeManagementService,
} from './capability-runtime-management.service';

describe(
  'CapabilityRuntimeManagementService',
  () => {
    function setup() {
      const instances = [
        {
          instanceId:
            'runtime-1',
          capabilityId:
            'creatoros.capability.one',
          capabilityVersion:
            '1.0.0',
          status:
            'running',
          lifecycleState:
            'active',
        },
        {
          instanceId:
            'runtime-2',
          capabilityId:
            'creatoros.capability.two',
          capabilityVersion:
            '1.0.0',
          status:
            'stopped',
          lifecycleState:
            'stopped',
        },
      ];

      const runtime = {
        listInstances:
          jest.fn(() =>
            instances,
          ),

        getInstance:
          jest.fn(
            (instanceId: string) => {
              const instance =
                instances.find(
                  (item) =>
                    item.instanceId ===
                    instanceId,
                );

              if (!instance) {
                throw new Error(
                  'Runtime instance was not found.',
                );
              }

              return instance;
            },
          ),

        start:
          jest.fn(
            async (input: {
              capabilityId: string;
            }) => ({
              instanceId:
                'runtime-new',
              capabilityId:
                input.capabilityId,
              previousStatus:
                'created',
              currentStatus:
                'running',
              lifecycleState:
                'active',
              changed: true,
              completedAt:
                new Date().toISOString(),
              message:
                'Runtime started.',
            }),
          ),

        stop:
          jest.fn(
            async (input: {
              instanceId: string;
            }) => {
              const instance =
                instances.find(
                  (item) =>
                    item.instanceId ===
                    input.instanceId,
                );

              if (!instance) {
                throw new Error(
                  'Runtime instance was not found.',
                );
              }

              return {
                instanceId:
                  input.instanceId,
                capabilityId:
                  instance.capabilityId,
                previousStatus:
                  instance.status,
                currentStatus:
                  'stopped',
                lifecycleState:
                  'stopped',
                changed: true,
                completedAt:
                  new Date().toISOString(),
                message:
                  'Runtime stopped.',
              };
            },
          ),

        healthCheck:
          jest.fn(
            async (
              instanceId: string,
            ) => ({
              instanceId,
              capabilityId:
                'creatoros.capability.one',
              report: {
                capabilityId:
                  'creatoros.capability.one',
                version:
                  '1.0.0',
                status:
                  'healthy',
                checks: [],
                generatedAt:
                  new Date().toISOString(),
              },
            }),
          ),
      };

      const audit =
        new CapabilityPlatformAuditService();

      const service =
        new CapabilityRuntimeManagementService(
          {
            runtime,
          } as never,
          audit,
        );

      return {
        service,
        runtime,
        audit,
      };
    }

    it(
      'filters and paginates runtime instances',
      () => {
        const { service } =
          setup();

        const result =
          service.list({
            status: 'running',
            page: 1,
            pageSize: 10,
          });

        expect(result.total).toBe(
          1,
        );

        expect(result.count).toBe(
          1,
        );

        expect(
          result.instances[0]
            ?.instanceId,
        ).toBe('runtime-1');
      },
    );

    it(
      'starts, stops and restarts runtime instances',
      async () => {
        const {
          service,
          runtime,
        } = setup();

        const started =
          await service.start({
            capabilityId:
              'creatoros.capability.one',
          });

        expect(
          started.currentStatus,
        ).toBe('running');

        const stopped =
          await service.stop(
            'runtime-1',
            {
              reason:
                'Unit test.',
            },
          );

        expect(
          stopped.currentStatus,
        ).toBe('stopped');

        const restarted =
          await service.restart(
            'runtime-1',
            {},
          );

        expect(
          restarted.previousInstanceId,
        ).toBe('runtime-1');

        expect(
          restarted.newInstanceId,
        ).toBe('runtime-new');

        expect(
          runtime.stop,
        ).toHaveBeenCalled();

        expect(
          runtime.start,
        ).toHaveBeenCalled();
      },
    );

    it(
      'returns runtime health and metrics',
      async () => {
        const { service } =
          setup();

        const health =
          await service.health(
            'runtime-1',
          );

        expect(
          health.report.status,
        ).toBe('healthy');

        const metrics =
          service.metrics();

        expect(
          metrics.totalInstances,
        ).toBe(2);

        expect(
          metrics.runningInstances,
        ).toBe(1);

        expect(
          metrics.stoppedInstances,
        ).toBe(1);

        expect(
          metrics.uniqueCapabilities,
        ).toBe(2);
      },
    );

    it(
      'bulk stops instances and reports partial failures',
      async () => {
        const { service } =
          setup();

        const result =
          await service.bulkStop({
            instanceIds: [
              'runtime-1',
              'runtime-missing',
            ],
          });

        expect(result.requested).toBe(
          2,
        );

        expect(result.succeeded).toBe(
          1,
        );

        expect(result.failed).toBe(
          1,
        );
      },
    );
  },
);