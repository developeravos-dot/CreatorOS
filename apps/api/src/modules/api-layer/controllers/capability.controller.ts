import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CapabilityApplicationService } from '../../application/services';

@Controller('capabilities')
export class CapabilityController {
  constructor(
    private readonly service: CapabilityApplicationService,
  ) {}

  @Post()
  create(
    @Body()
    data: Parameters<CapabilityApplicationService['create']>[0],
  ) {
    return this.service.create(data);
  }

  @Get()
  list() {
    return this.service.list({});
  }

  @Get('count')
  count() {
    return this.service.count({});
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
    data: Parameters<CapabilityApplicationService['update']>[1],
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
}