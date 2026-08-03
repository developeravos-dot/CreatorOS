import {
  CapabilityRuntimeManagementController,
} from './capability-runtime-management.controller';

describe(
  'CapabilityRuntimeManagementController',
  () => {
    it(
      'delegates runtime management operations',
      async () => {
        const runtime = {
          list:
            jest.fn(() => ({
              count: 0,
              total: 0,
              instances: [],
            })),

          getInstance:
            jest.fn(() => ({
              instanceId:
                'runtime-1',
            })),

          health:
            jest.fn(async () => ({
              report: {
                status:
                  'healthy',
              },
            })),

          metrics:
            jest.fn(() => ({
              totalInstances: 0,
            })),

          start:
            jest.fn(async () => ({
              currentStatus:
                'running',
            })),

          stop:
            jest.fn(async () => ({
              currentStatus:
                'stopped',
            })),

          restart:
            jest.fn(async () => ({
              newInstanceId:
                'runtime-new',
            })),

          bulkStop:
            jest.fn(async () => ({
              requested: 0,
              succeeded: 0,
              failed: 0,
            })),
        };

        const controller =
          new CapabilityRuntimeManagementController(
            runtime as never,
          );

        controller.list({});
        controller.getInstance(
          'runtime-1',
        );
        await controller.health(
          'runtime-1',
        );
        controller.metrics();

        await controller.start({
          capabilityId:
            'creatoros.capability.one',
        });

        await controller.stop(
          'runtime-1',
          {},
        );

        await controller.restart(
          'runtime-1',
          {},
        );

        await controller.bulkStop({
          instanceIds: [],
        });

        expect(
          runtime.list,
        ).toHaveBeenCalledTimes(1);

        expect(
          runtime.start,
        ).toHaveBeenCalledTimes(1);

        expect(
          runtime.restart,
        ).toHaveBeenCalledTimes(1);

        expect(
          runtime.bulkStop,
        ).toHaveBeenCalledTimes(1);
      },
    );
  },
);