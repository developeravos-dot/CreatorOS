import {
  NotFoundException,
} from '@nestjs/common';

import {
  CapabilityPlatformOperationsController,
} from './capability-platform-operations.controller';

describe(
  'CapabilityPlatformOperationsController',
  () => {
    function setup() {
      const operations = {
        listCapabilities:
          jest.fn(async () => []),

        getCapability:
          jest.fn(async () => ({
            id:
              'creatoros.capability.controller-test',
          })),

        registerCapability:
          jest.fn(async () => ({
            id:
              'creatoros.capability.controller-test',
          })),

        unregisterCapability:
          jest.fn(async () => ({
            capabilityId:
              'creatoros.capability.controller-test',
            unregistered: true,
          })),

        listRuntimeInstances:
          jest.fn(() => []),

        getRuntimeInstance:
          jest.fn(() => ({
            instanceId:
              'instance-controller-test',
          })),

        startRuntime:
          jest.fn(async () => ({
            currentStatus:
              'running',
          })),

        stopRuntime:
          jest.fn(async () => ({
            currentStatus:
              'stopped',
          })),
      };

      const controller =
        new CapabilityPlatformOperationsController(
          operations as never,
        );

      return {
        controller,
        operations,
      };
    }

    it(
      'delegates registry operations',
      async () => {
        const {
          controller,
          operations,
        } = setup();

        await expect(
          controller.listCapabilities(),
        ).resolves.toEqual([]);

        await expect(
          controller.getCapability(
            'creatoros.capability.controller-test',
          ),
        ).resolves.toEqual({
          id:
            'creatoros.capability.controller-test',
        });

        await expect(
          controller.registerCapability({
            manifest: {},
          }),
        ).resolves.toEqual({
          id:
            'creatoros.capability.controller-test',
        });

        await expect(
          controller.unregisterCapability(
            'creatoros.capability.controller-test',
            'tester',
            'correlation-1',
          ),
        ).resolves.toEqual({
          capabilityId:
            'creatoros.capability.controller-test',
          unregistered: true,
        });

        expect(
          operations.listCapabilities,
        ).toHaveBeenCalledTimes(1);

        expect(
          operations.getCapability,
        ).toHaveBeenCalledWith(
          'creatoros.capability.controller-test',
        );

        expect(
          operations.registerCapability,
        ).toHaveBeenCalledTimes(1);

        expect(
          operations.unregisterCapability,
        ).toHaveBeenCalledWith(
          'creatoros.capability.controller-test',
          'tester',
          'correlation-1',
        );
      },
    );

    it(
      'delegates runtime operations',
      async () => {
        const {
          controller,
          operations,
        } = setup();

        expect(
          controller.listRuntimeInstances(),
        ).toEqual([]);

        expect(
          controller.getRuntimeInstance(
            'instance-controller-test',
          ),
        ).toEqual({
          instanceId:
            'instance-controller-test',
        });

        await expect(
          controller.startRuntime({
            capabilityId:
              'creatoros.capability.controller-test',
          }),
        ).resolves.toEqual({
          currentStatus:
            'running',
        });

        await expect(
          controller.stopRuntime({
            instanceId:
              'instance-controller-test',
          }),
        ).resolves.toEqual({
          currentStatus:
            'stopped',
        });

        expect(
          operations.startRuntime,
        ).toHaveBeenCalledTimes(1);

        expect(
          operations.stopRuntime,
        ).toHaveBeenCalledTimes(1);
      },
    );

    it(
      'throws NotFoundException for missing capabilities',
      async () => {
        const operations = {
          getCapability:
            jest.fn(
              async () => undefined,
            ),
        };

        const controller =
          new CapabilityPlatformOperationsController(
            operations as never,
          );

        await expect(
          controller.getCapability(
            'creatoros.capability.missing',
          ),
        ).rejects.toBeInstanceOf(
          NotFoundException,
        );
      },
    );
  },
);