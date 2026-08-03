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
  RegisterCapabilityDto,
  StartCapabilityRuntimeDto,
  StopCapabilityRuntimeDto,
} from '../dto';
import {
  CapabilityPlatformOperationsService,
} from '../services';

@Controller('capability-platform')
export class CapabilityPlatformOperationsController {
  constructor(
    private readonly operations:
      CapabilityPlatformOperationsService,
  ) {}

  @Get('registry')
  listCapabilities() {
    return this.operations.listCapabilities();
  }

  @Get('registry/:capabilityId')
  async getCapability(
    @Param('capabilityId')
    capabilityId: string,
  ) {
    const capability =
      await this.operations.getCapability(
        capabilityId,
      );

    if (!capability) {
      throw new NotFoundException(
        `Capability ${capabilityId} was not found.`,
      );
    }

    return capability;
  }

  @Post('registry')
  registerCapability(
    @Body()
    input: RegisterCapabilityDto,
  ) {
    return this.operations.registerCapability(
      input,
    );
  }

  @Delete('registry/:capabilityId')
  unregisterCapability(
    @Param('capabilityId')
    capabilityId: string,

    @Query('actorId')
    actorId?: string,

    @Query('correlationId')
    correlationId?: string,
  ) {
    return this.operations.unregisterCapability(
      capabilityId,
      actorId,
      correlationId,
    );
  }

  @Get('runtime/instances')
  listRuntimeInstances() {
    return this.operations
      .listRuntimeInstances();
  }

  @Get('runtime/instances/:instanceId')
  getRuntimeInstance(
    @Param('instanceId')
    instanceId: string,
  ) {
    return this.operations.getRuntimeInstance(
      instanceId,
    );
  }

  @Post('runtime/start')
  startRuntime(
    @Body()
    input: StartCapabilityRuntimeDto,
  ) {
    return this.operations.startRuntime(
      input,
    );
  }

  @Post('runtime/stop')
  stopRuntime(
    @Body()
    input: StopCapabilityRuntimeDto,
  ) {
    return this.operations.stopRuntime(
      input,
    );
  }
}