import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import {
  ActivateManagedPluginDto,
  BulkPluginLifecycleDto,
  DeactivateManagedPluginDto,
  InstallManagedPluginDto,
  PluginLifecycleListQueryDto,
  UninstallManagedPluginDto,
} from '../dto';
import {
  CapabilityPluginLifecycleService,
} from '../services';

@Controller(
  'capability-platform/management/plugins',
)
export class CapabilityPluginLifecycleController {
  constructor(
    private readonly plugins:
      CapabilityPluginLifecycleService,
  ) {}

  @Get()
  list(
    @Query()
    query:
      PluginLifecycleListQueryDto,
  ) {
    return this.plugins.list(query);
  }

  @Get('metrics')
  metrics() {
    return this.plugins.metrics();
  }

  @Post()
  install(
    @Body()
    input:
      InstallManagedPluginDto,
  ) {
    return this.plugins.install(
      input,
    );
  }

  @Post('bulk/lifecycle')
  bulk(
    @Body()
    input:
      BulkPluginLifecycleDto,
  ) {
    return this.plugins.bulk(input);
  }

  @Get(':pluginKey')
  async get(
    @Param('pluginKey')
    pluginKey: string,
  ) {
    const plugin =
      await this.plugins.get(
        pluginKey,
      );

    if (!plugin) {
      throw new NotFoundException(
        `Plugin ${pluginKey} was not found.`,
      );
    }

    return plugin;
  }

  @Get(':pluginKey/package')
  async getPackage(
    @Param('pluginKey')
    pluginKey: string,
  ) {
    const pluginPackage =
      await this.plugins.getPackage(
        pluginKey,
      );

    if (!pluginPackage) {
      throw new NotFoundException(
        `Plugin package ${pluginKey} was not found.`,
      );
    }

    return pluginPackage;
  }

  @Post(':pluginKey/activate')
  activate(
    @Param('pluginKey')
    pluginKey: string,

    @Body()
    input:
      ActivateManagedPluginDto,
  ) {
    return this.plugins.activate(
      pluginKey,
      input,
    );
  }

  @Post(':pluginKey/deactivate')
  deactivate(
    @Param('pluginKey')
    pluginKey: string,

    @Body()
    input:
      DeactivateManagedPluginDto,
  ) {
    return this.plugins.deactivate(
      pluginKey,
      input,
    );
  }

  @Delete(':pluginKey')
  uninstall(
    @Param('pluginKey')
    pluginKey: string,

    @Body()
    input:
      UninstallManagedPluginDto,
  ) {
    return this.plugins.uninstall(
      pluginKey,
      input,
    );
  }
}