import type {
  Provider,
} from '@nestjs/common';

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
  CapabilityDependencyManagementService,
  CapabilityManagementService,
  CapabilityPlatformAuditService,
  CapabilityPlatformManagementService,
  CapabilityPlatformOperationsService,
  CapabilityPlatformService,
  CapabilityPluginLifecycleService,
  CapabilityRegistryAdministrationService,
  CapabilityRuntimeManagementService,
} from '../services';

export const CAPABILITY_PRODUCTION_PROVIDERS:
  readonly Provider[] = [
    CapabilityRegistryEngineService,

    InMemoryCapabilityRuntimeAdapter,

    {
      provide:
        CapabilityRuntimeAdapterRegistryService,
      inject: [
        InMemoryCapabilityRuntimeAdapter,
      ],
      useFactory: (
        adapter:
          InMemoryCapabilityRuntimeAdapter,
      ) => {
        const registry =
          new CapabilityRuntimeAdapterRegistryService();

        if (!registry.has(adapter.runtime)) {
          registry.register(adapter);
        }

        return registry;
      },
    },

    {
      provide:
        CapabilityRuntimeEngineService,
      inject: [
        CapabilityRegistryEngineService,
        CapabilityRuntimeAdapterRegistryService,
      ],
      useFactory: (
        registry:
          CapabilityRegistryEngineService,
        adapters:
          CapabilityRuntimeAdapterRegistryService,
      ) =>
        new CapabilityRuntimeEngineService(
          registry,
          adapters,
        ),
    },

    DependencyResolverEngineService,

    {
      provide:
        PluginHostEngineService,
      inject: [
        CapabilityRegistryEngineService,
        CapabilityRuntimeAdapterRegistryService,
        CapabilityRuntimeEngineService,
        DependencyResolverEngineService,
        InMemoryCapabilityRuntimeAdapter,
      ],
      useFactory: (
        registry:
          CapabilityRegistryEngineService,
        adapters:
          CapabilityRuntimeAdapterRegistryService,
        runtime:
          CapabilityRuntimeEngineService,
        resolver:
          DependencyResolverEngineService,
        runtimeAdapter:
          InMemoryCapabilityRuntimeAdapter,
      ) =>
        new PluginHostEngineService(
          registry,
          adapters,
          runtime,
          resolver,
          undefined,
          undefined,
          undefined,
          undefined,
          runtimeAdapter,
        ),
    },

    CapabilityPlatformAuditService,
    CapabilityPlatformService,
    CapabilityPlatformOperationsService,
    CapabilityPlatformManagementService,
    CapabilityManagementService,
    CapabilityRuntimeManagementService,
    CapabilityRegistryAdministrationService,
    CapabilityDependencyManagementService,
    CapabilityPluginLifecycleService,
  ];

export const CAPABILITY_PRODUCTION_EXPORTS = [
  CapabilityRegistryEngineService,
  CapabilityRuntimeAdapterRegistryService,
  InMemoryCapabilityRuntimeAdapter,
  CapabilityRuntimeEngineService,
  DependencyResolverEngineService,
  PluginHostEngineService,
  CapabilityPlatformAuditService,
  CapabilityPlatformService,
  CapabilityPlatformOperationsService,
  CapabilityPlatformManagementService,
  CapabilityManagementService,
  CapabilityRuntimeManagementService,
  CapabilityRegistryAdministrationService,
  CapabilityDependencyManagementService,
  CapabilityPluginLifecycleService,
] as const;