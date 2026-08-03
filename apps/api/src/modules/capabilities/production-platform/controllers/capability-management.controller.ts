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
  BulkCapabilityIdsDto,
  CapabilityManagementListQueryDto,
  RegisterManagedCapabilityDto,
  ValidateCapabilityManifestDto,
} from '../dto';
import {
  CapabilityManagementService,
} from '../services';

@Controller(
  'capability-platform/management',
)
export class CapabilityManagementController {
  constructor(
    private readonly management:
      CapabilityManagementService,
  ) {}

  @Get('capabilities')
  list(
    @Query()
    query:
      CapabilityManagementListQueryDto,
  ) {
    return this.management.list(
      query,
    );
  }

  @Get('capabilities/:capabilityId')
  async getRecord(
    @Param('capabilityId')
    capabilityId: string,
  ) {
    const record =
      await this.management.getRecord(
        capabilityId,
      );

    if (!record) {
      throw new NotFoundException(
        `Capability registry record ${capabilityId} was not found.`,
      );
    }

    return record;
  }

  @Get(
    'capabilities/:capabilityId/manifest',
  )
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

  @Post('capabilities')
  register(
    @Body()
    input:
      RegisterManagedCapabilityDto,
  ) {
    return this.management.register(
      input,
    );
  }

  @Delete(
    'capabilities/:capabilityId',
  )
  unregister(
    @Param('capabilityId')
    capabilityId: string,

    @Query('actorId')
    actorId?: string,

    @Query('correlationId')
    correlationId?: string,
  ) {
    return this.management.unregister(
      capabilityId,
      actorId,
      correlationId,
    );
  }

  @Post('manifests/validate')
  validateManifest(
    @Body()
    input:
      ValidateCapabilityManifestDto,
  ) {
    return this.management
      .validateManifest(input);
  }

  @Post(
    'capabilities/bulk/unregister',
  )
  bulkUnregister(
    @Body()
    input:
      BulkCapabilityIdsDto,
  ) {
    return this.management
      .bulkUnregister(input);
  }
}