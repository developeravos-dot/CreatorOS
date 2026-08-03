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
  CapabilityPlatformOperationsService,
} from './capability-platform-operations.service';
import {
  CapabilityPlatformService,
} from './capability-platform.service';

describe(
  'CapabilityPlatformOperationsService',
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

      const operations =
        new CapabilityPlatformOperationsService(
          platform,
          audit,
        );

      return {
        adapter,
        audit,
        operations,
      };
    }

    const factory =
      new CapabilityManifestFactory();

    const createManifest = () =>
      factory.create({
        id:
          'creatoros.capability.operations-step-2',
        name:
          'Operations Step 2',
        version: '1.0.0',
        description:
          'Capability used to verify production registry and runtime operations.',
        domain: 'platform',
        kind: 'extension',
        publisher: {
          name: 'CreatorOS',
        },
        entrypoint: {
          runtime: 'node',
          module:
            './operations-step-2',
        },
        dependencies: [],
        policy:
          createDefaultCapabilityPolicy(),
      });

    it(
      'registers, retrieves, lists and unregisters capabilities',
      async () => {
        const {
          operations,
          audit,
        } = setup();

        const manifest =
          createManifest();

        await operations.registerCapability({
          manifest:
            manifest as unknown as
              Record<string, unknown>,
          actorId: 'tester',
          correlationId:
            'registry-operation',
        });

        await expect(
          operations.getCapability(
            manifest.id,
          ),
        ).resolves.toEqual(
          manifest,
        );

        await expect(
          operations.listCapabilities(),
        ).resolves.toHaveLength(1);

        await operations.unregisterCapability(
          manifest.id,
          'tester',
          'registry-operation',
        );

        await expect(
          operations.listCapabilities(),
        ).resolves.toHaveLength(0);

        expect(audit.count()).toBe(2);
      },
    );

    it(
      'starts and stops registered runtime providers',
      async () => {
        const {
          adapter,
          operations,
          audit,
        } = setup();

        const manifest =
          createManifest();

        const initialize =
          jest.fn(async () => undefined);

        const activate =
          jest.fn(async () => undefined);

        const stop =
          jest.fn(async () => undefined);

        adapter.registerProvider(
          manifest.entrypoint.module,
          {
            manifest,
            lifecycle: {
              state: 'registered',
              initialize,
              activate,
              stop,
            },
          },
        );

        await operations.registerCapability({
          manifest:
            manifest as unknown as
              Record<string, unknown>,
        });

        const started =
          await operations.startRuntime({
            capabilityId:
              manifest.id,
            actorId: 'tester',
            correlationId:
              'runtime-operation',
            metadata: {
              source: 'step-2-test',
            },
          });

        expect(
          started.currentStatus,
        ).toBe('running');

        expect(
          operations.listRuntimeInstances(),
        ).toHaveLength(1);

        expect(
          operations.getRuntimeInstance(
            started.instanceId,
          ).instanceId,
        ).toBe(started.instanceId);

        const stopped =
          await operations.stopRuntime({
            instanceId:
              started.instanceId,
            reason:
              'Step 2 completed.',
          });

        expect(
          stopped.currentStatus,
        ).toBe('stopped');

        expect(initialize).toHaveBeenCalledTimes(1);
        expect(activate).toHaveBeenCalledTimes(1);
        expect(stop).toHaveBeenCalledTimes(1);

        expect(audit.count()).toBe(3);
      },
    );

    it(
      'records failed operations',
      async () => {
        const {
          operations,
          audit,
        } = setup();

        await expect(
          operations.unregisterCapability(
            'creatoros.capability.missing',
          ),
        ).rejects.toThrow();

        expect(audit.list()).toEqual([
          expect.objectContaining({
            operation:
              'operation.failed',
            successful: false,
            subjectId:
              'creatoros.capability.missing',
            metadata: {
              requestedOperation:
                'capability.unregistered',
            },
          }),
        ]);
      },
    );
  },
);