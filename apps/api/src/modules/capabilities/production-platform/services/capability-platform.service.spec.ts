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
  CapabilityPlatformAuditService,
} from './capability-platform-audit.service';
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

      const audit =
        new CapabilityPlatformAuditService();

      const service =
        new CapabilityPlatformService(
          registry,
          runtime,
          resolver,
          pluginHost,
          audit,
        );

      return {
        service,
        registry,
        runtime,
        resolver,
        pluginHost,
        audit,
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
          audit,
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

        expect(service.audit).toBe(
          audit,
        );
      },
    );

    it(
      'returns operational status',
      async () => {
        const {
          service,
          audit,
        } = setup();

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

        expect(audit.count()).toBe(1);
      },
    );

    it(
      'returns healthy component status',
      async () => {
        const { service } = setup();

        const health =
          await service.health();

        expect(health.status).toBe(
          'healthy',
        );

        expect(
          health.components.registry.status,
        ).toBe('healthy');

        expect(
          health.components.runtime.status,
        ).toBe('healthy');

        expect(
          health.components
            .dependencyResolver.status,
        ).toBe('healthy');

        expect(
          health.components
            .pluginHost.status,
        ).toBe('healthy');

        expect(
          health.components.audit.status,
        ).toBe('healthy');
      },
    );

    it(
      'returns accurate empty metrics',
      async () => {
        const { service } = setup();

        const metrics =
          await service.metrics();

        expect(metrics).toMatchObject({
          registeredCapabilities: 0,
          runtimeInstances: 0,
          activeRuntimeInstances: 0,
          stoppedRuntimeInstances: 0,
          failedRuntimeInstances: 0,
          installedPlugins: 0,
          activePlugins: 0,
          inactivePlugins: 0,
          failedPlugins: 0,
          auditEvents: 0,
        });
      },
    );

    it(
      'returns audit history',
      async () => {
        const {
          service,
          audit,
        } = setup();

        await service.status();
        await service.health();

        const records =
          service.auditRecords();

        expect(records).toHaveLength(2);
        expect(audit.count()).toBe(3);
      },
    );
  },
);