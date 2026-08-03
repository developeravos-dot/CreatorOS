import 'reflect-metadata';

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
  CapabilityPlatformService,
} from './capability-platform.service';

describe(
  'CapabilityPlatformService',
  () => {
    function setup() {
      const registry =
        new CapabilityRegistryEngineService();

      const adapter =
        new InMemoryCapabilityRuntimeAdapter();

      const adapterRegistry =
        new CapabilityRuntimeAdapterRegistryService();

      adapterRegistry.register(adapter);

      const runtime =
        new CapabilityRuntimeEngineService(
          registry,
          adapterRegistry,
        );

      const resolver =
        new DependencyResolverEngineService();

      const pluginHost =
        new PluginHostEngineService(
          registry,
          adapterRegistry,
          runtime,
          resolver,
        );

      const service =
        new CapabilityPlatformService(
          registry,
          runtime,
          resolver,
          pluginHost,
        );

      return {
        service,
        registry,
        runtime,
        resolver,
        pluginHost,
      };
    }

    it(
      'composes all production engines',
      () => {
        const {
          service,
          registry,
          runtime,
          resolver,
          pluginHost,
        } = setup();

        expect(service.registry).toBe(
          registry,
        );

        expect(service.runtime).toBe(
          runtime,
        );

        expect(
          service.dependencyResolver,
        ).toBe(resolver);

        expect(service.pluginHost).toBe(
          pluginHost,
        );
      },
    );

    it(
      'returns an operational empty-platform status',
      async () => {
        const { service } = setup();

        const status =
          await service.status();

        expect(status).toMatchObject({
          name:
            'CreatorOS Capability Platform',
          version: '1.1.0',
          state: 'operational',
          registry: {
            registeredCapabilities: 0,
          },
          runtime: {
            totalInstances: 0,
            activeInstances: 0,
            stoppedInstances: 0,
            failedInstances: 0,
          },
          plugins: {
            installedPlugins: 0,
            activePlugins: 0,
            inactivePlugins: 0,
            failedPlugins: 0,
          },
        });

        expect(
          status.generatedAt,
        ).toBeTruthy();
      },
    );

    it(
      'reports all production systems',
      async () => {
        const { service } = setup();

        const status =
          await service.status();

        expect(status.systems).toEqual({
          registryEngine: true,
          runtimeEngine: true,
          dependencyResolver: true,
          pluginHost: true,
          persistentRegistry: true,
        });
      },
    );
  },
);