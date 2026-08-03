import 'reflect-metadata';

import type {
  CapabilityDependencyContract,
  CapabilityManifestContract,
} from '../../../contracts';
import type {
  CapabilityProvider,
} from '../../../interfaces';
import {
  CapabilityManifestFactory,
  createDefaultCapabilityPolicy,
} from '../../../manifest';
import {
  CapabilityAlreadyRegisteredError,
  CapabilityRegistryEngineService,
} from '../../../registry-engine';
import {
  CapabilityRuntimeAdapterRegistryService,
  CapabilityRuntimeEngineService,
  InMemoryCapabilityRuntimeAdapter,
} from '../../../runtime-engine';
import {
  DependencyResolverEngineService,
} from '../../../dependency-resolver';
import {
  PluginDependencyResolutionError,
  PluginHostEngineService,
  type PluginPackageContract,
} from '../../../plugin-host';

interface LifecycleSpies {
  readonly initialize: jest.Mock<
    Promise<void>,
    [unknown?]
  >;
  readonly activate: jest.Mock<
    Promise<void>,
    [unknown?]
  >;
  readonly stop: jest.Mock<
    Promise<void>,
    [unknown?]
  >;
}

const manifestFactory =
  new CapabilityManifestFactory();

const createManifest = (
  id: string,
  version = '1.0.0',
  dependencies:
    readonly CapabilityDependencyContract[] = [],
  moduleName = `./${id}`,
): CapabilityManifestContract =>
  manifestFactory.create({
    id,
    name: id,
    version,
    description:
      `Production integration manifest for ${id}.`,
    domain: 'platform',
    kind: 'extension',
    publisher: {
      name: 'CreatorOS',
    },
    entrypoint: {
      runtime: 'node',
      module: moduleName,
    },
    dependencies: [...dependencies],
    policy: createDefaultCapabilityPolicy(),
    tags: [
      'sdk',
      'integration',
      'production',
    ],
    metadata: {
      integrationSuite:
        'full-sdk-production-v1.1',
    },
  });

const createProvider = (
  manifest: CapabilityManifestContract,
): {
  readonly provider: CapabilityProvider;
  readonly lifecycle: LifecycleSpies;
} => {
  const initialize = jest.fn(
    async () => undefined,
  );

  const activate = jest.fn(
    async () => undefined,
  );

  const stop = jest.fn(
    async () => undefined,
  );

  const provider:
    CapabilityProvider = {
      manifest,
      lifecycle: {
        state: 'registered',
        initialize,
        activate,
        stop,
      },
    };

  return {
    provider,
    lifecycle: {
      initialize,
      activate,
      stop,
    },
  };
};

const createPluginPackage = (
  pluginKey: string,
  manifest: CapabilityManifestContract,
  provider: CapabilityProvider,
): PluginPackageContract => ({
  pluginKey,
  name: manifest.name,
  version: manifest.version,
  description:
    `Production integration package for ${pluginKey}.`,
  capabilityManifest: manifest,
  provider,
  metadata: {
    integrationSuite:
      'full-sdk-production-v1.1',
  },
});

describe(
  'Capability SDK Full Production Integration v1.1',
  () => {
    it(
      'integrates registry, runtime adapter and lifecycle execution',
      async () => {
        const manifest =
          createManifest(
            'creatoros.capability.full-sdk-runtime',
            '1.0.0',
            [],
            './full-sdk-runtime',
          );

        const {
          provider,
          lifecycle,
        } = createProvider(manifest);

        const registry =
          new CapabilityRegistryEngineService();

        const adapterRegistry =
          new CapabilityRuntimeAdapterRegistryService();

        const adapter =
          new InMemoryCapabilityRuntimeAdapter();

        adapter.registerProvider(
          manifest.entrypoint.module,
          provider,
        );

        adapterRegistry.register(adapter);

        const runtime =
          new CapabilityRuntimeEngineService(
            registry,
            adapterRegistry,
          );

        await registry.register(manifest);

        const record =
          await registry.getRecord(
            manifest.id,
          );

        expect(record).toBeDefined();
        expect(record?.state).toBe(
          'registered',
        );
        expect(
          record?.validation.valid,
        ).toBe(true);

        const started =
          await runtime.start({
            capabilityId: manifest.id,
            correlationId:
              'full-sdk-runtime-correlation',
            actorId:
              'full-sdk-integration-suite',
            metadata: {
              source:
                'full-sdk-integration',
            },
          });

        expect(
          started.currentStatus,
        ).toBe('running');

        expect(
          started.lifecycleState,
        ).toBe('active');

        expect(
          lifecycle.initialize,
        ).toHaveBeenCalledTimes(1);

        expect(
          lifecycle.activate,
        ).toHaveBeenCalledTimes(1);

        const health =
          await runtime.healthCheck(
            started.instanceId,
          );

        expect(
          health.report.status,
        ).toBe('healthy');

        const stopped =
          await runtime.stop({
            instanceId:
              started.instanceId,
            reason:
              'Full integration test completed.',
            correlationId:
              'full-sdk-runtime-correlation',
            actorId:
              'full-sdk-integration-suite',
          });

        expect(
          stopped.currentStatus,
        ).toBe('stopped');

        expect(
          stopped.lifecycleState,
        ).toBe('stopped');

        expect(
          lifecycle.stop,
        ).toHaveBeenCalledTimes(1);

        await registry.unregister(
          manifest.id,
        );

        expect(
          await registry.has(
            manifest.id,
          ),
        ).toBe(false);
      },
    );

    it(
      'resolves a multi-capability dependency chain in executable order',
      () => {
        const database =
          createManifest(
            'creatoros.capability.full-sdk-database',
            '1.3.0',
          );

        const knowledge =
          createManifest(
            'creatoros.capability.full-sdk-knowledge',
            '1.1.0',
            [
              {
                capabilityId:
                  database.id,
                versionRange:
                  '^1.0.0',
                type: 'required',
              },
            ],
          );

        const application =
          createManifest(
            'creatoros.capability.full-sdk-application',
            '1.0.0',
            [
              {
                capabilityId:
                  knowledge.id,
                versionRange:
                  '^1.0.0',
                type: 'required',
              },
            ],
          );

        const resolver =
          new DependencyResolverEngineService();

        const result =
          resolver.resolve({
            rootCapabilityId:
              application.id,
            catalog: [
              {
                capabilityId:
                  application.id,
                version:
                  application.version,
                manifest:
                  application,
              },
              {
                capabilityId:
                  knowledge.id,
                version:
                  knowledge.version,
                manifest:
                  knowledge,
              },
              {
                capabilityId:
                  database.id,
                version:
                  database.version,
                manifest:
                  database,
              },
            ],
          });

        expect(result.status).toBe(
          'resolved',
        );

        expect(
          result.orderedCapabilityIds,
        ).toEqual([
          database.id,
          knowledge.id,
          application.id,
        ]);

        expect(result.issues).toEqual(
          [],
        );

        const plan =
          resolver.createPlan({
            rootCapabilityId:
              application.id,
            catalog: [
              {
                capabilityId:
                  application.id,
                version:
                  application.version,
                manifest:
                  application,
              },
              {
                capabilityId:
                  knowledge.id,
                version:
                  knowledge.version,
                manifest:
                  knowledge,
              },
              {
                capabilityId:
                  database.id,
                version:
                  database.version,
                manifest:
                  database,
              },
            ],
          });

        expect(plan.executable).toBe(
          true,
        );

        expect(
          plan.orderedCapabilityIds,
        ).toEqual([
          database.id,
          knowledge.id,
          application.id,
        ]);

        expect(
          plan.steps.length,
        ).toBeGreaterThan(0);
      },
    );

    it(
      'runs the complete plugin install, activate, deactivate and uninstall lifecycle',
      async () => {
        const dependencyManifest =
          createManifest(
            'creatoros.capability.full-sdk-plugin-dependency',
            '1.2.0',
            [],
            './full-sdk-plugin-dependency',
          );

        const dependencyProvider =
          createProvider(
            dependencyManifest,
          );

        const rootManifest =
          createManifest(
            'creatoros.capability.full-sdk-plugin-root',
            '1.0.0',
            [
              {
                capabilityId:
                  dependencyManifest.id,
                versionRange:
                  '^1.0.0',
                type: 'required',
              },
            ],
            './full-sdk-plugin-root',
          );

        const rootProvider =
          createProvider(rootManifest);

        const dependencyPackage =
          createPluginPackage(
            'creatoros.plugin.full-sdk-dependency',
            dependencyManifest,
            dependencyProvider.provider,
          );

        const rootPackage =
          createPluginPackage(
            'creatoros.plugin.full-sdk-root',
            rootManifest,
            rootProvider.provider,
          );

        const host =
          new PluginHostEngineService();

        const dependencyInstall =
          await host.install({
            package:
              dependencyPackage,
          });

        expect(
          dependencyInstall.currentState,
        ).toBe('installed');

        const rootInstall =
          await host.install({
            package: rootPackage,
          });

        expect(
          rootInstall.currentState,
        ).toBe('installed');

        expect(
          await host.listInstalled(),
        ).toHaveLength(2);

        const activated =
          await host.activate({
            pluginKey:
              rootPackage.pluginKey,
            actorId:
              'full-sdk-integration-suite',
            correlationId:
              'full-sdk-plugin-correlation',
            metadata: {
              source:
                'full-sdk-integration',
            },
          });

        expect(
          activated.currentState,
        ).toBe('active');

        expect(
          activated.runtimeInstanceId,
        ).toBeTruthy();

        expect(
          rootProvider.lifecycle
            .initialize,
        ).toHaveBeenCalledTimes(1);

        expect(
          rootProvider.lifecycle
            .activate,
        ).toHaveBeenCalledTimes(1);

        const deactivated =
          await host.deactivate({
            pluginKey:
              rootPackage.pluginKey,
            reason:
              'Full SDK integration test completed.',
            actorId:
              'full-sdk-integration-suite',
            correlationId:
              'full-sdk-plugin-correlation',
          });

        expect(
          deactivated.currentState,
        ).toBe('inactive');

        expect(
          rootProvider.lifecycle.stop,
        ).toHaveBeenCalledTimes(1);

        const uninstalled =
          await host.uninstall({
            pluginKey:
              rootPackage.pluginKey,
            actorId:
              'full-sdk-integration-suite',
            correlationId:
              'full-sdk-plugin-correlation',
          });

        expect(
          uninstalled.changed,
        ).toBe(true);

        expect(
          await host.getInstalled(
            rootPackage.pluginKey,
          ),
        ).toBeUndefined();

        await host.uninstall({
          pluginKey:
            dependencyPackage.pluginKey,
        });

        expect(
          await host.listInstalled(),
        ).toHaveLength(0);
      },
    );

    it(
      'rejects plugin installation when a required dependency is missing',
      async () => {
        const manifest =
          createManifest(
            'creatoros.capability.full-sdk-missing-dependency',
            '1.0.0',
            [
              {
                capabilityId:
                  'creatoros.capability.not-installed',
                versionRange:
                  '^1.0.0',
                type: 'required',
              },
            ],
            './full-sdk-missing-dependency',
          );

        const { provider } =
          createProvider(manifest);

        const pluginPackage =
          createPluginPackage(
            'creatoros.plugin.full-sdk-missing-dependency',
            manifest,
            provider,
          );

        const host =
          new PluginHostEngineService();

        await expect(
          host.install({
            package: pluginPackage,
          }),
        ).rejects.toBeInstanceOf(
          PluginDependencyResolutionError,
        );

        expect(
          await host.listInstalled(),
        ).toHaveLength(0);
      },
    );

    it(
      'rejects incompatible dependency versions',
      () => {
        const database =
          createManifest(
            'creatoros.capability.full-sdk-versioned-database',
            '2.0.0',
          );

        const application =
          createManifest(
            'creatoros.capability.full-sdk-versioned-application',
            '1.0.0',
            [
              {
                capabilityId:
                  database.id,
                versionRange:
                  '^1.0.0',
                type: 'required',
              },
            ],
          );

        const resolver =
          new DependencyResolverEngineService();

        const result =
          resolver.resolve({
            rootCapabilityId:
              application.id,
            catalog: [
              {
                capabilityId:
                  application.id,
                version:
                  application.version,
                manifest:
                  application,
              },
              {
                capabilityId:
                  database.id,
                version:
                  database.version,
                manifest:
                  database,
              },
            ],
          });

        expect(result.status).toBe(
          'incompatible',
        );

        expect(
          result.issues.some(
            (issue) =>
              issue.code ===
              'DEPENDENCY_VERSION_INCOMPATIBLE',
          ),
        ).toBe(true);
      },
    );

    it(
      'records plugin activation lifecycle failures without corrupting installation state',
      async () => {
        const manifest =
          createManifest(
            'creatoros.capability.full-sdk-failing-plugin',
            '1.0.0',
            [],
            './full-sdk-failing-plugin',
          );

        const {
          provider,
          lifecycle,
        } = createProvider(manifest);

        lifecycle.activate.mockRejectedValueOnce(
          new Error(
            'Planned production integration activation failure.',
          ),
        );

        const pluginPackage =
          createPluginPackage(
            'creatoros.plugin.full-sdk-failing-plugin',
            manifest,
            provider,
          );

        const host =
          new PluginHostEngineService();

        await host.install({
          package: pluginPackage,
        });

        await expect(
          host.activate({
            pluginKey:
              pluginPackage.pluginKey,
          }),
        ).rejects.toThrow(
          'Capability "creatoros.capability.full-sdk-failing-plugin" could not be loaded by the runtime.',
        );

        const installed =
          await host.getInstalled(
            pluginPackage.pluginKey,
          );

        expect(installed).toBeDefined();

        expect(installed?.state).toBe(
          'failed',
        );

        expect(
          lifecycle.initialize,
        ).toHaveBeenCalledTimes(1);

        expect(
          lifecycle.activate,
        ).toHaveBeenCalledTimes(1);
      },
    );

    it(
      'preserves production registry duplicate protection',
      async () => {
        const manifest =
          createManifest(
            'creatoros.capability.full-sdk-duplicate',
          );

        const registry =
          new CapabilityRegistryEngineService();

        await registry.register(manifest);

        await expect(
          registry.register(manifest),
        ).rejects.toBeInstanceOf(
          CapabilityAlreadyRegisteredError,
        );

        expect(
          await registry.list(),
        ).toHaveLength(1);
      },
    );
  },
);