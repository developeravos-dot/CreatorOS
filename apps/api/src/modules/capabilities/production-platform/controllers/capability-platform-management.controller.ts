import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import {
  CapabilityManagementQueryDto,
  ResolveManagedDependenciesDto,
} from '../dto';
import {
  CapabilityPlatformManagementService,
} from '../services';

@Controller(
  'capability-platform/management',
)
export class CapabilityPlatformManagementController {
  constructor(
    private readonly management:
      CapabilityPlatformManagementService,
  ) {}

  @Get('registry/records')
  listRegistryRecords(
    @Query()
    query:
      CapabilityManagementQueryDto,
  ) {
    return this.management
      .listRegistryRecords(query);
  }

  @Get('registry/records/:capabilityId')
  async getRegistryRecord(
    @Param('capabilityId')
    capabilityId: string,
  ) {
    const record =
      await this.management.getRegistryRecord(
        capabilityId,
      );

    if (!record) {
      throw new NotFoundException(
        `Registry record ${capabilityId} was not found.`,
      );
    }

    return record;
  }

  @Get('manifests/:capabilityId')
  async getManifest(
    @Param('capabilityId')
    capabilityId: string,
  ) {
    const manifest =
      await this.management.getManifest(
        capabilityId,
      );

    if (!manifest) {
      throw new NotFoundException(
        `Capability manifest ${capabilityId} was not found.`,
      );
    }

    return manifest;
  }

  @Get('runtime/instances')
  listRuntimeInstances() {
    return this.management
      .listRuntimeInstances();
  }

  @Get('runtime/instances/:instanceId')
  getRuntimeInstance(
    @Param('instanceId')
    instanceId: string,
  ) {
    return this.management
      .getRuntimeInstance(instanceId);
  }

  @Get('runtime/instances/:instanceId/health')
  getRuntimeHealth(
    @Param('instanceId')
    instanceId: string,
  ) {
    return this.management
      .getRuntimeHealth(instanceId);
  }

  @Post('dependencies/resolve')
  resolveDependencies(
    @Body()
    input:
      ResolveManagedDependenciesDto,
  ) {
    return this.management
      .resolveDependencies(input);
  }

  @Post('dependencies/plan')
  createDependencyPlan(
    @Body()
    input:
      ResolveManagedDependenciesDto,
  ) {
    return this.management
      .createDependencyPlan(input);
  }

  @Get('plugins')
  listPlugins() {
    return this.management.listPlugins();
  }

  @Get('plugins/:pluginKey')
  async getPlugin(
    @Param('pluginKey')
    pluginKey: string,
  ) {
    const plugin =
      await this.management.getPlugin(
        pluginKey,
      );

    if (!plugin) {
      throw new NotFoundException(
        `Plugin ${pluginKey} was not found.`,
      );
    }

    return plugin;
  }

  @Get('plugins/:pluginKey/package')
  async getPluginPackage(
    @Param('pluginKey')
    pluginKey: string,
  ) {
    const pluginPackage =
      await this.management
        .getPluginPackage(pluginKey);

    if (!pluginPackage) {
      throw new NotFoundException(
        `Plugin package ${pluginKey} was not found.`,
      );
    }

    return pluginPackage;
  }
}