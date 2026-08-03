import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import {
  BulkRuntimeInstanceIdsDto,
  RestartManagedRuntimeDto,
  RuntimeManagementListQueryDto,
  StartManagedRuntimeDto,
  StopManagedRuntimeDto,
} from '../dto';
import {
  CapabilityRuntimeManagementService,
} from '../services';

@Controller(
  'capability-platform/management/runtime',
)
export class CapabilityRuntimeManagementController {
  constructor(
    private readonly runtime:
      CapabilityRuntimeManagementService,
  ) {}

  @Get('instances')
  list(
    @Query()
    query:
      RuntimeManagementListQueryDto,
  ) {
    return this.runtime.list(
      query,
    );
  }

  @Get('instances/:instanceId')
  getInstance(
    @Param('instanceId')
    instanceId: string,
  ) {
    return this.runtime.getInstance(
      instanceId,
    );
  }

  @Get('instances/:instanceId/health')
  health(
    @Param('instanceId')
    instanceId: string,
  ) {
    return this.runtime.health(
      instanceId,
    );
  }

  @Get('metrics')
  metrics() {
    return this.runtime.metrics();
  }

  @Post('instances/start')
  start(
    @Body()
    input:
      StartManagedRuntimeDto,
  ) {
    return this.runtime.start(
      input,
    );
  }

  @Post('instances/bulk/stop')
  bulkStop(
    @Body()
    input:
      BulkRuntimeInstanceIdsDto,
  ) {
    return this.runtime.bulkStop(
      input,
    );
  }

  @Post('instances/:instanceId/stop')
  stop(
    @Param('instanceId')
    instanceId: string,

    @Body()
    input:
      StopManagedRuntimeDto,
  ) {
    return this.runtime.stop(
      instanceId,
      input,
    );
  }

  @Post('instances/:instanceId/restart')
  restart(
    @Param('instanceId')
    instanceId: string,

    @Body()
    input:
      RestartManagedRuntimeDto,
  ) {
    return this.runtime.restart(
      instanceId,
      input,
    );
  }
}