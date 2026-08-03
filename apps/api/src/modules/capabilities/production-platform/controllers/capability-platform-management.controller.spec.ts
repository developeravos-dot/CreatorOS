import {
  NotFoundException,
} from '@nestjs/common';

import {
  CapabilityPlatformManagementController,
} from './capability-platform-management.controller';

describe(
  'CapabilityPlatformManagementController',
  () => {
    function setup() {
      const management = {
        listRegistryRecords:
          jest.fn(async () => ({
            total: 0,
            count: 0,
            records: [],
          })),

        getRegistryRecord:
          jest.fn(async () => ({
            state:
              'registered',
          })),

        getManifest:
          jest.fn(async () => ({
            id:
              'creatoros.capability.management-controller',
          })),

        listRuntimeInstances:
          jest.fn(() => ({
            count: 0,
            instances: [],
          })),

        getRuntimeInstance:
          jest.fn(() => ({
            instanceId:
              'runtime-1',
          })),

        getRuntimeHealth:
          jest.fn(async () => ({
            report: {
              status:
                'healthy',
            },
          })),

        resolveDependencies:
          jest.fn(() => ({
            status:
              'resolved',
          })),

        createDependencyPlan:
          jest.fn(() => ({
            executable:
              true,
          })),

        listPlugins:
          jest.fn(async () => ({
            count: 0,
            plugins: [],
          })),

        getPlugin:
          jest.fn(async () => ({
            pluginKey:
              'plugin-1',
          })),

        getPluginPackage:
          jest.fn(async () => ({
            pluginKey:
              'plugin-1',
          })),
      };

      const controller =
        new CapabilityPlatformManagementController(
          management as never,
        );

      return {
        controller,
        management,
      };
    }

    it(
      'delegates management operations',
      async () => {
        const {
          controller,
          management,
        } = setup();

        await controller.listRegistryRecords(
          {},
        );

        await controller.getRegistryRecord(
          'capability-1',
        );

        await controller.getManifest(
          'capability-1',
        );

        controller.listRuntimeInstances();

        controller.getRuntimeInstance(
          'runtime-1',
        );

        await controller.getRuntimeHealth(
          'runtime-1',
        );

        controller.resolveDependencies({
          rootCapabilityId:
            'capability-1',
          catalog: [],
        });

        controller.createDependencyPlan({
          rootCapabilityId:
            'capability-1',
          catalog: [],
        });

        await controller.listPlugins();

        await controller.getPlugin(
          'plugin-1',
        );

        await controller.getPluginPackage(
          'plugin-1',
        );

        expect(
          management.listRegistryRecords,
        ).toHaveBeenCalledTimes(1);

        expect(
          management.getRuntimeHealth,
        ).toHaveBeenCalledWith(
          'runtime-1',
        );

        expect(
          management.createDependencyPlan,
        ).toHaveBeenCalledTimes(1);
      },
    );

    it(
      'throws for missing records',
      async () => {
        const controller =
          new CapabilityPlatformManagementController(
            {
              getRegistryRecord:
                jest.fn(
                  async () =>
                    undefined,
                ),
            } as never,
          );

        await expect(
          controller.getRegistryRecord(
            'missing',
          ),
        ).rejects.toBeInstanceOf(
          NotFoundException,
        );
      },
    );

    it(
      'throws for missing plugin packages',
      async () => {
        const controller =
          new CapabilityPlatformManagementController(
            {
              getPluginPackage:
                jest.fn(
                  async () =>
                    undefined,
                ),
            } as never,
          );

        await expect(
          controller.getPluginPackage(
            'missing',
          ),
        ).rejects.toBeInstanceOf(
          NotFoundException,
        );
      },
    );
  },
);