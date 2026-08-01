import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OrganizationApplicationService } from '../../application/services';

@Controller('organization-units')
export class OrganizationController {
  constructor(
    private readonly service: OrganizationApplicationService,
  ) {}

  @Post()
  createUnit(
    @Body()
    data: Parameters<OrganizationApplicationService['createUnit']>[0],
  ) {
    return this.service.createUnit(data);
  }

  @Get()
  listUnits() {
    return this.service.listUnits({});
  }

  @Get('count')
  countUnits() {
    return this.service.countUnits({});
  }

  @Get(':id')
  getUnit(
    @Param('id')
    id: string,
  ) {
    return this.service.getUnit(id);
  }

  @Patch(':id')
  updateUnit(
    @Param('id')
    id: string,
    @Body()
    data: Parameters<OrganizationApplicationService['updateUnit']>[1],
  ) {
    return this.service.updateUnit(
      id,
      data,
    );
  }

  @Delete(':id')
  removeUnit(
    @Param('id')
    id: string,
  ) {
    return this.service.removeUnit(id);
  }
}