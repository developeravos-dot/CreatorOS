import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
} from '@nestjs/common';

import {
  BulkRegisterCapabilitiesDto,
  BulkUnregisterCapabilitiesDto,
  ClearCapabilityRegistryDto,
  RestoreCapabilityRegistrySnapshotDto,
} from '../dto';
import {
  CapabilityRegistryAdministrationService,
} from '../services';

@Controller(
  'capability-platform/management/registry',
)
export class CapabilityRegistryAdministrationController {
  constructor(
    private readonly administration:
      CapabilityRegistryAdministrationService,
  ) {}

  @Get('overview')
  overview() {
    return this.administration
      .overview();
  }

  @Get('consistency')
  consistency() {
    return this.administration
      .consistency();
  }

  @Get('snapshot')
  snapshot() {
    return this.administration
      .snapshot();
  }

  @Post('bulk/register')
  bulkRegister(
    @Body()
    input:
      BulkRegisterCapabilitiesDto,
  ) {
    return this.administration
      .bulkRegister(input);
  }

  @Post('bulk/unregister')
  bulkUnregister(
    @Body()
    input:
      BulkUnregisterCapabilitiesDto,
  ) {
    return this.administration
      .bulkUnregister(input);
  }

  @Post('snapshot/restore')
  restore(
    @Body()
    input:
      RestoreCapabilityRegistrySnapshotDto,
  ) {
    return this.administration
      .restore(input);
  }

  @Delete('clear')
  clear(
    @Body()
    input:
      ClearCapabilityRegistryDto,
  ) {
    return this.administration
      .clear(input);
  }
}