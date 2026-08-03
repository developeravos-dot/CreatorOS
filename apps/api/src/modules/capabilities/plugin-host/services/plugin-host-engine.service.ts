import { Injectable } from '@nestjs/common';

import {
  DependencyResolverEngineService,
} from '../../dependency-resolver';
import {
  CapabilityRegistryEngineService,
} from '../../registry-engine';
import {
  CapabilityRuntimeAdapterRegistryService,
  CapabilityRuntimeEngineService,
  InMemoryCapabilityRuntimeAdapter,
} from '../../runtime-engine';
import type {
  ActivatePluginRequest,
  DeactivatePluginRequest,
  InstalledPluginContract,
  InstallPluginRequest,
  PluginHostOperationResult,
  PluginPackageContract,
  UninstallPluginRequest,
} from '../contracts';
import {
  PluginAlreadyActiveError,
  PluginAlreadyInstalledError,
  PluginDependencyResolutionError,
  PluginNotInstalledError,
  PluginUninstallBlockedError,
} from '../errors/plugin-host.errors';
import {
  InstalledPluginModel,
} from '../models';
import {
  InMemoryInstalledPluginRepository,
  InMemoryPluginPackageRepository,
} from '../repositories';
import {
  PluginDependencyCatalogFactory,
} from './plugin-dependency-catalog.factory';
import {
  PluginPackageValidatorService,
} from './plugin-package-validator.service';

@Injectable()
export class PluginHostEngineService {
  private readonly registry:
    CapabilityRegistryEngineService;

  private readonly adapterRegistry:
    CapabilityRuntimeAdapterRegistryService;

  private readonly runtimeAdapter:
    InMemoryCapabilityRuntimeAdapter;

  private readonly runtime:
    CapabilityRuntimeEngineService;

  private readonly resolver:
    DependencyResolverEngineService;

  private readonly packageRepository:
    InMemoryPluginPackageRepository;

  private readonly installedRepository:
    InMemoryInstalledPluginRepository;

  private readonly packageValidator:
    PluginPackageValidatorService;

  private readonly catalogFactory:
    PluginDependencyCatalogFactory;

  constructor(
    registry?: CapabilityRegistryEngineService,
    adapterRegistry?:
      CapabilityRuntimeAdapterRegistryService,
    runtime?: CapabilityRuntimeEngineService,
    resolver?: DependencyResolverEngineService,
    packageRepository?:
      InMemoryPluginPackageRepository,
    installedRepository?:
      InMemoryInstalledPluginRepository,
    packageValidator?:
      PluginPackageValidatorService,
    catalogFactory?:
      PluginDependencyCatalogFactory,
  ) {
    this.registry =
      registry ??
      new CapabilityRegistryEngineService();

    this.adapterRegistry =
      adapterRegistry ??
      new CapabilityRuntimeAdapterRegistryService();

    this.runtimeAdapter =
      new InMemoryCapabilityRuntimeAdapter();

    if (!this.adapterRegistry.has('node')) {
      this.adapterRegistry.register(
        this.runtimeAdapter,
      );
    }

    this.runtime =
      runtime ??
      new CapabilityRuntimeEngineService(
        this.registry,
        this.adapterRegistry,
      );

    this.resolver =
      resolver ??
      new DependencyResolverEngineService();

    this.packageRepository =
      packageRepository ??
      new InMemoryPluginPackageRepository();

    this.installedRepository =
      installedRepository ??
      new InMemoryInstalledPluginRepository();

    this.packageValidator =
      packageValidator ??
      new PluginPackageValidatorService();

    this.catalogFactory =
      catalogFactory ??
      new PluginDependencyCatalogFactory();
  }

  async install(
    request: InstallPluginRequest,
  ): Promise<PluginHostOperationResult> {
    const pluginPackage = request.package;

    if (
      await this.installedRepository.exists(
        pluginPackage.pluginKey,
      )
    ) {
      throw new PluginAlreadyInstalledError(
        pluginPackage.pluginKey,
      );
    }

    await this.packageValidator.validate(
      pluginPackage,
    );

    const installedPackages =
      await this.packageRepository.findAll();

    const catalog =
      this.catalogFactory.create(
        installedPackages,
        pluginPackage,
      );

    const resolution = this.resolver.resolve({
      rootCapabilityId:
        pluginPackage.capabilityManifest.id,
      catalog,
      includeOptional:
        request.includeOptionalDependencies ??
        false,
      enforcePeerDependencies:
        request.enforcePeerDependencies ?? true,
    });

    if (
      resolution.status !== 'resolved'
    ) {
      throw new PluginDependencyResolutionError(
        pluginPackage.pluginKey,
        resolution.issues,
      );
    }

    await this.registry.register(
      pluginPackage.capabilityManifest,
    );

    this.runtimeAdapter.registerProvider(
      pluginPackage.capabilityManifest
        .entrypoint.module,
      pluginPackage.provider,
    );

    await this.packageRepository.save(
      pluginPackage,
    );

    const now = new Date().toISOString();

    const installedPlugin =
      new InstalledPluginModel(
        pluginPackage.pluginKey,
        pluginPackage.capabilityManifest.id,
        pluginPackage.version,
        'installed',
        now,
        now,
        undefined,
        undefined,
        pluginPackage.metadata,
      );

    await this.installedRepository.save(
      installedPlugin.snapshot(),
    );

    return {
      pluginKey: pluginPackage.pluginKey,
      capabilityId:
        pluginPackage.capabilityManifest.id,
      previousState: 'discovered',
      currentState: 'installed',
      changed: true,
      completedAt: now,
      message:
        'Plugin installed successfully.',
    };
  }

  async activate(
    request: ActivatePluginRequest,
  ): Promise<PluginHostOperationResult> {
    const installed =
      await this.requireInstalled(
        request.pluginKey,
      );

    if (installed.state === 'active') {
      throw new PluginAlreadyActiveError(
        request.pluginKey,
      );
    }

    const pluginPackage =
      await this.requirePackage(
        request.pluginKey,
      );

    const model = this.toModel(installed);

    const previousState = model.state;

    model.transition('activating');

    await this.installedRepository.save(
      model.snapshot(),
    );

    try {
      const runtimeResult =
        await this.runtime.start({
          capabilityId:
            pluginPackage.capabilityManifest.id,
          correlationId:
            request.correlationId,
          actorId: request.actorId,
          metadata: request.metadata,
        });

      model.transition(
        'active',
        runtimeResult.instanceId,
      );

      await this.installedRepository.save(
        model.snapshot(),
      );

      return {
        pluginKey: request.pluginKey,
        capabilityId:
          installed.capabilityId,
        previousState,
        currentState: 'active',
        changed: true,
        completedAt:
          new Date().toISOString(),
        runtimeInstanceId:
          runtimeResult.instanceId,
        message:
          'Plugin activated successfully.',
      };
    } catch (error) {
      model.transition(
        'failed',
        undefined,
        error,
      );

      await this.installedRepository.save(
        model.snapshot(),
      );

      throw error;
    }
  }

  async deactivate(
    request: DeactivatePluginRequest,
  ): Promise<PluginHostOperationResult> {
    const installed =
      await this.requireInstalled(
        request.pluginKey,
      );

    if (
      installed.state !== 'active' ||
      !installed.runtimeInstanceId
    ) {
      return {
        pluginKey: installed.pluginKey,
        capabilityId:
          installed.capabilityId,
        previousState: installed.state,
        currentState: installed.state,
        changed: false,
        completedAt:
          new Date().toISOString(),
        message:
          'Plugin is not active.',
      };
    }

    const model = this.toModel(installed);
    const previousState = model.state;

    model.transition(
      'deactivating',
      installed.runtimeInstanceId,
    );

    await this.installedRepository.save(
      model.snapshot(),
    );

    await this.runtime.stop({
      instanceId:
        installed.runtimeInstanceId,
      reason: request.reason,
      correlationId:
        request.correlationId,
      actorId: request.actorId,
    });

    model.transition('inactive');

    await this.installedRepository.save(
      model.snapshot(),
    );

    return {
      pluginKey: installed.pluginKey,
      capabilityId:
        installed.capabilityId,
      previousState,
      currentState: 'inactive',
      changed: true,
      completedAt:
        new Date().toISOString(),
      message:
        'Plugin deactivated successfully.',
    };
  }

  async uninstall(
    request: UninstallPluginRequest,
  ): Promise<PluginHostOperationResult> {
    const installed =
      await this.requireInstalled(
        request.pluginKey,
      );

    const previousState = installed.state;

    if (
      installed.state === 'active' &&
      !request.force
    ) {
      throw new PluginUninstallBlockedError(
        request.pluginKey,
      );
    }

    if (
      installed.state === 'active' &&
      installed.runtimeInstanceId
    ) {
      await this.deactivate({
        pluginKey: request.pluginKey,
        reason:
          request.reason ??
          'Forced plugin uninstall.',
        actorId: request.actorId,
        correlationId:
          request.correlationId,
      });
    }

    await this.registry.unregister(
      installed.capabilityId,
    );

    await this.packageRepository.delete(
      request.pluginKey,
    );

    await this.installedRepository.delete(
      request.pluginKey,
    );

    return {
      pluginKey: request.pluginKey,
      capabilityId:
        installed.capabilityId,
      previousState,
      currentState: 'uninstalling',
      changed: true,
      completedAt:
        new Date().toISOString(),
      message:
        'Plugin uninstalled successfully.',
    };
  }

  async getInstalled(
    pluginKey: string,
  ): Promise<InstalledPluginContract | undefined> {
    return this.installedRepository.findByKey(
      pluginKey,
    );
  }

  async listInstalled(): Promise<
    readonly InstalledPluginContract[]
  > {
    return this.installedRepository.findAll();
  }

  async getPackage(
    pluginKey: string,
  ): Promise<PluginPackageContract | undefined> {
    return this.packageRepository.findByKey(
      pluginKey,
    );
  }

  private async requireInstalled(
    pluginKey: string,
  ): Promise<InstalledPluginContract> {
    const installed =
      await this.installedRepository.findByKey(
        pluginKey,
      );

    if (!installed) {
      throw new PluginNotInstalledError(
        pluginKey,
      );
    }

    return installed;
  }

  private async requirePackage(
    pluginKey: string,
  ): Promise<PluginPackageContract> {
    const pluginPackage =
      await this.packageRepository.findByKey(
        pluginKey,
      );

    if (!pluginPackage) {
      throw new PluginNotInstalledError(
        pluginKey,
      );
    }

    return pluginPackage;
  }

  private toModel(
    installed: InstalledPluginContract,
  ): InstalledPluginModel {
    return new InstalledPluginModel(
      installed.pluginKey,
      installed.capabilityId,
      installed.version,
      installed.state,
      installed.installedAt,
      installed.updatedAt,
      installed.runtimeInstanceId,
      installed.lastError,
      installed.metadata,
    );
  }
}