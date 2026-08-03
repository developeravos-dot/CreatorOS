import {
  NotFoundException,
} from '@nestjs/common';

import {
  CapabilityPluginLifecycleController,
} from './capability-plugin-lifecycle.controller';

describe(
  'CapabilityPluginLifecycleController',
  () => {
    function setup() {
      const plugins = {
        list:
          jest.fn(async () => ({
            count: 0,
            total: 0,
            plugins: [],
          })),

        metrics:
          jest.fn(async () => ({
            totalPlugins: 0,
          })),

        get:
          jest.fn(async () => ({
            pluginKey:
              'plugin-one',
          })),

        getPackage:
          jest.fn(async () => ({
            pluginKey:
              'plugin-one',
          })),

        install:
          jest.fn(async () => ({
            currentState:
              'installed',
          })),

        activate:
          jest.fn(async () => ({
            currentState:
              'active',
          })),

        deactivate:
          jest.fn(async () => ({
            currentState:
              'inactive',
          })),

        uninstall:
          jest.fn(async () => ({
            currentState:
              'uninstalling',
          })),

        bulk:
          jest.fn(async () => ({
            requested: 0,
          })),
      };

      const controller =
        new CapabilityPluginLifecycleController(
          plugins as never,
        );

      return {
        controller,
        plugins,
      };
    }

    it(
      'delegates lifecycle operations',
      async () => {
        const {
          controller,
          plugins,
        } = setup();

        await controller.list({});
        await controller.metrics();
        await controller.get(
          'plugin-one',
        );
        await controller.getPackage(
          'plugin-one',
        );

        await controller.install({
          package: {},
        });

        await controller.activate(
          'plugin-one',
          {},
        );

        await controller.deactivate(
          'plugin-one',
          {},
        );

        await controller.uninstall(
          'plugin-one',
          {},
        );

        await controller.bulk({
          pluginKeys: [],
          operation:
            'activate',
        });

        expect(
          plugins.install,
        ).toHaveBeenCalledTimes(1);

        expect(
          plugins.activate,
        ).toHaveBeenCalledTimes(1);

        expect(
          plugins.bulk,
        ).toHaveBeenCalledTimes(1);
      },
    );

    it(
      'throws for missing plugins',
      async () => {
        const controller =
          new CapabilityPluginLifecycleController(
            {
              get:
                jest.fn(
                  async () =>
                    undefined,
                ),
            } as never,
          );

        await expect(
          controller.get('missing'),
        ).rejects.toBeInstanceOf(
          NotFoundException,
        );
      },
    );

    it(
      'throws for missing packages',
      async () => {
        const controller =
          new CapabilityPluginLifecycleController(
            {
              getPackage:
                jest.fn(
                  async () =>
                    undefined,
                ),
            } as never,
          );

        await expect(
          controller.getPackage(
            'missing',
          ),
        ).rejects.toBeInstanceOf(
          NotFoundException,
        );
      },
    );
  },
);