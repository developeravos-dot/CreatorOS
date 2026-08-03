import 'reflect-metadata';

import {
  CapabilityManifestFactory,
  createDefaultCapabilityPolicy,
} from '../../manifest';
import {
  CapabilityRegistryEngineService,
} from '../../registry-engine';
import {
  CapabilityRuntimeAdapterRegistryService,
  CapabilityRuntimeEngineService,
  InMemoryCapabilityRuntimeAdapter,
} from '../../runtime-engine';
import {
  DependencyResolverEngineService,
} from '../../dependency-resolver';
import {
  PluginHostEngineService,
} from '../../plugin-host';
import {
  CapabilityPlatformAuditService,
} from './capability-platform-audit.service';
import {
  CapabilityPlatformManagementService,
} from './capability-platform-management.service';
import {
  CapabilityPlatformService,
} from './capability-platform.service';

describe(
  'CapabilityPlatformManagementService',
  () => {
    function setup() {
      const registry =
        new CapabilityRegistryEngineService();

      const adapter =
        new InMemoryCapabilityRuntimeAdapter();

      const adapters =
        new CapabilityRuntimeAdapterRegistryService();

      adapters.register(adapter);

      const runtime =
        new CapabilityRuntimeEngineService(
          registry,
          adapters,
        );

      const resolver =
        new DependencyResolverEngineService();

      const pluginHost =
        new PluginHostEngineService(
          registry,
          adapters,
          runtime,
          resolver,
          undefined,
          undefined,
          undefined,
          undefined,
          adapter,
        );

      const audit =
        new CapabilityPlatformAuditService();

      const platform =
        new CapabilityPlatformService(
          registry,
          runtime,
          resolver,
          pluginHost,
          audit,
        );

      const management =
        new CapabilityPlatformManagementService(
          platform,
          audit,
        );

      return {
        registry,
        adapter,
        runtime,
        pluginHost,
        audit,
        management,
      };
    }

    const factory =
      new CapabilityManifestFactory();

    const createManifest = (
      id:
        string =
          'creatoros.capability.management-test',
      domain:
        string =
          'platform',
    ) =>
      factory.create({
        id,
        name:
          'Management Test',
        version:
          '1.0.0',
        description:
          'Capability management API test manifest.',
        domain,
        kind:
          'extension',
        publisher: {
          name:
            'CreatorOS',
        },
        entrypoint: {
          runtime:
            'node',
          module:
            `./${id}`,
        },
        dependencies: [],
        policy:
          createDefaultCapabilityPolicy(),
      });

    it(
      'lists and filters registry records',
      async () => {
        const {
          registry,
          management,
        } = setup();

        const platformManifest =
          createManifest(
            'creatoros.capability.platform-test',
            'platform',
          );

        const mediaManifest =
          createManifest(
            'creatoros.capability.media-test',
            'media',
          );

        await registry.register(
          platformManifest,
        );

        await registry.register(
          mediaManifest,
        );

        const all =
          await management.listRegistryRecords();

        expect(all.total).toBe(2);
        expect(all.count).toBe(2);

        const filtered =
          await management.listRegistryRecords({
            domain: 'media',
          });

        expect(filtered.count).toBe(1);

        expect(
          filtered.records[0]
            ?.manifest.id,
        ).toBe(
          mediaManifest.id,
        );
      },
    );

    it(
      'returns registry record and manifest details',
      async () => {
        const {
          registry,
          management,
        } = setup();

        const manifest =
          createManifest();

        await registry.register(
          manifest,
        );

        await expect(
          management.getRegistryRecord(
            manifest.id,
          ),
        ).resolves.toEqual(
          expect.objectContaining({
            manifest,
            state:
              'registered',
          }),
        );

        await expect(
          management.getManifest(
            manifest.id,
          ),
        ).resolves.toEqual(
          manifest,
        );
      },
    );

    it(
      'returns runtime instance and health details',
      async () => {
        const {
          registry,
          adapter,
          runtime,
          management,
        } = setup();

        const manifest =
          createManifest();

        adapter.registerProvider(
          manifest.entrypoint.module,
          {
            manifest,
            lifecycle: {
              state:
                'registered',
              async initialize() {
                return undefined;
              },
              async activate() {
                return undefined;
              },
              async stop() {
                return undefined;
              },
            },
          },
        );

        await registry.register(
          manifest,
        );

        const started =
          await runtime.start({
            capabilityId:
              manifest.id,
          });

        const list =
          management.listRuntimeInstances();

        expect(list.count).toBe(1);

        expect(
          management.getRuntimeInstance(
            started.instanceId,
          ).instanceId,
        ).toBe(
          started.instanceId,
        );

        const health =
          await management.getRuntimeHealth(
            started.instanceId,
          );

        expect(
          health.report.status,
        ).toBe('healthy');
      },
    );

    it(
      'resolves dependencies and creates a plan',
      () => {
        const { management } =
          setup();

        const manifest =
          createManifest();

        const catalog = [
          {
            capabilityId:
              manifest.id,
            version:
              manifest.version,
            manifest,
          },
        ] as unknown as
          Record<string, unknown>[];

        const resolution =
          management.resolveDependencies({
            rootCapabilityId:
              manifest.id,
            catalog,
          });

        expect(
          resolution.status,
        ).toBe('resolved');

        const plan =
          management.createDependencyPlan({
            rootCapabilityId:
              manifest.id,
            catalog,
          });

        expect(plan.executable).toBe(
          true,
        );
      },
    );

    it(
      'returns plugin and package details',
      async () => {
        const {
          pluginHost,
          management,
        } = setup();

        const manifest =
          createManifest();

        await pluginHost.install({
          package: {
            pluginKey:
              'creatoros.plugin.management-test',
            name:
              'Management Test Plugin',
            version:
              manifest.version,
            capabilityManifest:
              manifest,
            provider: {
              manifest,
              lifecycle: {
                state:
                  'registered',
                async initialize() {
                  return undefined;
                },
                async activate() {
                  return undefined;
                },
                async stop() {
                  return undefined;
                },
              },
            },
          },
        });

        const plugins =
          await management.listPlugins();

        expect(plugins.count).toBe(1);

        await expect(
          management.getPlugin(
            'creatoros.plugin.management-test',
          ),
        ).resolves.toEqual(
          expect.objectContaining({
            state:
              'installed',
          }),
        );

        await expect(
          management.getPluginPackage(
            'creatoros.plugin.management-test',
          ),
        ).resolves.toEqual(
          expect.objectContaining({
            pluginKey:
              'creatoros.plugin.management-test',
          }),
        );
      },
    );
  },
);