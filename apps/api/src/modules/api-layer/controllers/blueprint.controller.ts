import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BlueprintApplicationService } from '../../application/services';

@Controller('blueprints')
export class BlueprintController {
  constructor(
    private readonly service: BlueprintApplicationService,
  ) {}

  @Post()
  create(
    @Body()
    data: Parameters<BlueprintApplicationService['create']>[0],
  ) {
    return this.service.create(data);
  }

  @Get()
  list() {
    return this.service.list({});
  }

  @Get(':id')
  getById(
    @Param('id')
    id: string,
  ) {
    return this.service.getById(id);
  }

  @Patch(':id')
  update(
    @Param('id')
    id: string,
    @Body()
    data: Parameters<BlueprintApplicationService['update']>[1],
  ) {
    return this.service.update(
      id,
      data,
    );
  }

  @Delete(':id')
  remove(
    @Param('id')
    id: string,
  ) {
    return this.service.remove(id);
  }

  @Post(':id/versions')
  createVersion(
    @Param('id')
    _id: string,
    @Body()
    data: Parameters<BlueprintApplicationService['createVersion']>[0],
  ) {
    return this.service.createVersion(data);
  }

  @Get(':id/versions')
  listVersions(
    @Param('id')
    id: string,
  ) {
    return this.service.listVersions({
      blueprintId: id,
    });
  }
}