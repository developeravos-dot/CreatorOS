import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import type {
  RegisterPluginInput,
} from '@creatoros/runtime';
import {
  RuntimeCompatibilityError,
  RuntimeDependencyError,
  RuntimeLifecycleError,
  RuntimePluginNotFoundError,
  RuntimeValidationError,
} from '@creatoros/runtime';
import { RuntimeService } from './runtime.service';

@Controller('runtime')
export class RuntimeController {
  constructor(
    private readonly runtimeService:
      RuntimeService,
  ) {}

  @Get('status')
  getStatus() {
    return this.runtimeService.getHealth();
  }

  @Get('health')
  getHealth() {
    return this.runtimeService.getHealth();
  }

  @Post('bootstrap')
  bootstrapRuntime() {
    try {
      return this.runtimeService
        .bootstrapRuntime();
    } catch (error) {
      this.handleRuntimeError(error);
    }
  }

  @Get('plugins')
  getPlugins() {
    return this.runtimeService.getPlugins();
  }

  @Get('plugins/by-key/:pluginKey')
  getPluginByKey(
    @Param('pluginKey')
    pluginKey: string,
  ) {
    const plugin =
      this.runtimeService
        .getPluginByKey(pluginKey);

    if (!plugin) {
      throw new NotFoundException({
        statusCode: 404,
        error:
          'Runtime Plugin Not Found',
        message:
          `Runtime plugin ${pluginKey} was not found`,
      });
    }

    return plugin;
  }

  @Get('plugins/:pluginId')
  getPluginById(
    @Param('pluginId')
    pluginId: string,
  ) {
    const plugin =
      this.runtimeService
        .getPluginById(pluginId);

    if (!plugin) {
      throw new NotFoundException({
        statusCode: 404,
        error:
          'Runtime Plugin Not Found',
        message:
          `Runtime plugin ${pluginId} was not found`,
      });
    }

    return plugin;
  }

  @Post('plugins')
  registerPlugin(
    @Body()
    input: RegisterPluginInput,
  ) {
    try {
      return this.runtimeService
        .registerPlugin(input);
    } catch (error) {
      this.handleRuntimeError(error);
    }
  }

  @Post('plugins/:pluginId/validate')
  validatePlugin(
    @Param('pluginId')
    pluginId: string,
  ) {
    try {
      return this.runtimeService
        .validatePlugin(pluginId);
    } catch (error) {
      this.handleRuntimeError(error);
    }
  }

  @Post('plugins/:pluginId/load')
  loadPlugin(
    @Param('pluginId')
    pluginId: string,
  ) {
    try {
      return this.runtimeService
        .loadPlugin(pluginId);
    } catch (error) {
      this.handleRuntimeError(error);
    }
  }

  @Post('plugins/:pluginId/start')
  startPlugin(
    @Param('pluginId')
    pluginId: string,
  ) {
    try {
      return this.runtimeService
        .startPlugin(pluginId);
    } catch (error) {
      this.handleRuntimeError(error);
    }
  }

  @Post('plugins/:pluginId/stop')
  stopPlugin(
    @Param('pluginId')
    pluginId: string,
  ) {
    try {
      return this.runtimeService
        .stopPlugin(pluginId);
    } catch (error) {
      this.handleRuntimeError(error);
    }
  }

  @Post('plugins/:pluginId/enable')
  enablePlugin(
    @Param('pluginId')
    pluginId: string,
  ) {
    try {
      return this.runtimeService
        .enablePlugin(pluginId);
    } catch (error) {
      this.handleRuntimeError(error);
    }
  }

  @Post('plugins/:pluginId/disable')
  disablePlugin(
    @Param('pluginId')
    pluginId: string,
  ) {
    try {
      return this.runtimeService
        .disablePlugin(pluginId);
    } catch (error) {
      this.handleRuntimeError(error);
    }
  }

  @Post('plugins/:pluginId/unload')
  unloadPlugin(
    @Param('pluginId')
    pluginId: string,
  ) {
    try {
      return this.runtimeService
        .unloadPlugin(pluginId);
    } catch (error) {
      this.handleRuntimeError(error);
    }
  }

  @Get('capabilities')
  getCapabilities() {
    return this.runtimeService
      .getCapabilities();
  }

  @Get('capabilities/:capabilityKey')
  getCapability(
    @Param('capabilityKey')
    capabilityKey: string,
  ) {
    const capability =
      this.runtimeService
        .getCapability(capabilityKey);

    if (!capability) {
      throw new NotFoundException({
        statusCode: 404,
        error:
          'Runtime Capability Not Found',
        message:
          `Runtime capability ${capabilityKey} was not found`,
      });
    }

    return capability;
  }

  @Get('lifecycle-events')
  getLifecycleEvents(
    @Query('pluginId')
    pluginId?: string,
  ) {
    return this.runtimeService
      .getLifecycleEvents(pluginId);
  }

  private handleRuntimeError(
    error: unknown,
  ): never {
    if (
      error instanceof
        RuntimePluginNotFoundError
    ) {
      throw new NotFoundException({
        statusCode: 404,
        error:
          'Runtime Resource Not Found',
        message: error.message,
      });
    }

    if (
      error instanceof
        RuntimeValidationError ||
      error instanceof
        RuntimeDependencyError ||
      error instanceof
        RuntimeCompatibilityError ||
      error instanceof
        RuntimeLifecycleError
    ) {
      throw new BadRequestException({
        statusCode: 400,
        error:
          'Invalid Runtime Operation',
        message: error.message,
      });
    }

    throw error;
  }
}
