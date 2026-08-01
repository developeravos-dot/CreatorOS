import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import {
  CreateEcosystemEntityInput,
  EcosystemEntityStatus,
  EcosystemEntityType,
  MediaEcosystemService,
  UpdateEcosystemEntityInput,
} from './media-ecosystem.service';

@Controller('youtube/media-ecosystem')
export class MediaEcosystemController {
  constructor(
    private readonly mediaEcosystemService: MediaEcosystemService,
  ) {}

  @Get('status')
  getStatus() {
    return this.mediaEcosystemService.getStatus();
  }

  @Get('entities')
  listEntities(
    @Query('type') type?: EcosystemEntityType,
    @Query('status') status?: EcosystemEntityStatus,
    @Query('search') search?: string,
  ) {
    return this.mediaEcosystemService.listEntities({
      type,
      status,
      search,
    });
  }

  @Get('entities/:id')
  getEntity(@Param('id') id: string) {
    return this.mediaEcosystemService.getEntity(id);
  }

  @Post('entities')
  createEntity(
    @Body() input: CreateEcosystemEntityInput,
  ) {
    return this.mediaEcosystemService.createEntity(input);
  }

  @Patch('entities/:id')
  updateEntity(
    @Param('id') id: string,
    @Body() input: UpdateEcosystemEntityInput,
  ) {
    return this.mediaEcosystemService.updateEntity(
      id,
      input,
    );
  }

  @Delete('entities/:id')
  removeEntity(@Param('id') id: string) {
    return this.mediaEcosystemService.removeEntity(id);
  }

  @Get('relationship-map')
  getRelationshipMap() {
    return this.mediaEcosystemService.buildRelationshipMap();
  }
}
