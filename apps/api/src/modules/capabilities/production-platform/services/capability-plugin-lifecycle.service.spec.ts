import {
  CapabilityPlatformAuditService,
} from './capability-platform-audit.service';
import {
  CapabilityPluginLifecycleService,
} from './capability-plugin-lifecycle.service';

describe(
  'CapabilityPluginLifecycleService',
  () => {
    function operationResult(
      pluginKey: string,
      currentState: string,
    ) {
      return {
        pluginKey,
        capabilityId:
          `creatoros.capability.${pluginKey}`,
        previousState:
          'installed',
        currentState,
        changed: true,
        completedAt:
          new Date().toISOString(),
        message:
          'Completed.',
      };
    }

    function setup() {
      const plugins = [
        {
          pluginKey:
            'creatoros.plugin.one',
          capabilityId:
            'creatoros.capability.one',
          version:
            '1.0.0',
          state:
            'active',
          installedAt:
            new Date().toISOString(),
          updatedAt:
            new Date().toISOString(),
          runtimeInstanceId:
            'runtime-one',
        },
        {
          pluginKey:
            'creatoros.plugin.two',
          capabilityId:
            'creatoros.capability.two',
          version:
            '1.0.0',
          state:
            'installed',
          installedAt:
            new Date().toISOString(),
          updatedAt:
            new Date().toISOString(),
        },
      ];

      const pluginHost = {
        listInstalled:
          jest.fn(
            async () =>
              plugins,
          ),

        getInstalled:
          jest.fn(
            async (
              pluginKey: string,
            ) =>
              plugins.find(
                (plugin) =>
                  plugin.pluginKey ===
                  pluginKey,
              ),
          ),

        getPackage:
          jest.fn(
            async (
              pluginKey: string,
            ) =>
              pluginKey ===
              'creatoros.plugin.one'
                ? {
                    pluginKey,
                    name:
                      'Plugin One',
                  }
                : undefined,
          ),

        install:
          jest.fn(
            async (request: {
              package: {
                pluginKey: string;
              };
            }) =>
              operationResult(
                request.package
                  .pluginKey,
                'installed',
              ),
          ),

        activate:
          jest.fn(
            async (request: {
              pluginKey: string;
            }) =>
              operationResult(
                request.pluginKey,
                'active',
              ),
          ),

        deactivate:
          jest.fn(
            async (request: {
              pluginKey: string;
            }) =>
              operationResult(
                request.pluginKey,
                'inactive',
              ),
          ),

        uninstall:
          jest.fn(
            async (request: {
              pluginKey: string;
            }) => {
              if (
                request.pluginKey ===
                'creatoros.plugin.failure'
              ) {
                throw new Error(
                  'Planned plugin lifecycle failure.',
                );
              }

              return operationResult(
                request.pluginKey,
                'uninstalling',
              );
            },
          ),
      };

      const audit =
        new CapabilityPlatformAuditService();

      const service =
        new CapabilityPluginLifecycleService(
          {
            pluginHost,
          } as never,
          audit,
        );

      return {
        service,
        pluginHost,
        audit,
      };
    }

    it(
      'lists and filters installed plugins',
      async () => {
        const { service } =
          setup();

        const all =
          await service.list();

        expect(all.total).toBe(2);
        expect(all.count).toBe(2);

        const active =
          await service.list({
            state: 'active',
          });

        expect(active.count).toBe(1);

        expect(
          active.plugins[0]
            ?.pluginKey,
        ).toBe(
          'creatoros.plugin.one',
        );
      },
    );

    it(
      'returns plugin and package details',
      async () => {
        const { service } =
          setup();

        await expect(
          service.get(
            'creatoros.plugin.one',
          ),
        ).resolves.toEqual(
          expect.objectContaining({
            state: 'active',
          }),
        );

        await expect(
          service.getPackage(
            'creatoros.plugin.one',
          ),
        ).resolves.toEqual(
          expect.objectContaining({
            name:
              'Plugin One',
          }),
        );
      },
    );

    it(
      'installs activates deactivates and uninstalls plugins',
      async () => {
        const {
          service,
          pluginHost,
        } = setup();

        const installed =
          await service.install({
            package: {
              pluginKey:
                'creatoros.plugin.new',
            },
          });

        expect(
          installed.currentState,
        ).toBe('installed');

        const activated =
          await service.activate(
            'creatoros.plugin.new',
            {},
          );

        expect(
          activated.currentState,
        ).toBe('active');

        const deactivated =
          await service.deactivate(
            'creatoros.plugin.new',
            {
              reason:
                'Test.',
            },
          );

        expect(
          deactivated.currentState,
        ).toBe('inactive');

        const uninstalled =
          await service.uninstall(
            'creatoros.plugin.new',
            {
              force: true,
            },
          );

        expect(
          uninstalled.currentState,
        ).toBe('uninstalling');

        expect(
          pluginHost.install,
        ).toHaveBeenCalledTimes(1);

        expect(
          pluginHost.activate,
        ).toHaveBeenCalledTimes(1);

        expect(
          pluginHost.deactivate,
        ).toHaveBeenCalledTimes(1);

        expect(
          pluginHost.uninstall,
        ).toHaveBeenCalledTimes(1);
      },
    );

    it(
      'calculates lifecycle metrics',
      async () => {
        const { service } =
          setup();

        const metrics =
          await service.metrics();

        expect(
          metrics.totalPlugins,
        ).toBe(2);

        expect(
          metrics.activePlugins,
        ).toBe(1);

        expect(
          metrics.installedPlugins,
        ).toBe(1);

        expect(
          metrics.pluginsWithRuntime,
        ).toBe(1);
      },
    );

    it(
      'runs bulk lifecycle operations',
      async () => {
        const { service } =
          setup();

        const result =
          await service.bulk({
            pluginKeys: [
              'creatoros.plugin.one',
              'creatoros.plugin.two',
            ],
            operation:
              'activate',
          });

        expect(result.requested).toBe(
          2,
        );

        expect(result.processed).toBe(
          2,
        );

        expect(result.succeeded).toBe(
          2,
        );

        expect(result.failed).toBe(0);
      },
    );

    it(
      'records bulk failures and stops when requested',
      async () => {
        const {
          service,
          audit,
        } = setup();

        const result =
          await service.bulk({
            pluginKeys: [
              'creatoros.plugin.failure',
              'creatoros.plugin.two',
            ],
            operation:
              'uninstall',
            continueOnError:
              false,
          });

        expect(result.requested).toBe(
          2,
        );

        expect(result.processed).toBe(
          1,
        );

        expect(result.succeeded).toBe(
          0,
        );

        expect(result.failed).toBe(1);

        expect(
          audit.list().some(
            (record) =>
              record.operation ===
                'operation.failed' &&
              record.message?.includes(
                'Planned plugin lifecycle failure.',
              ),
          ),
        ).toBe(true);
      },
    );
  },
);