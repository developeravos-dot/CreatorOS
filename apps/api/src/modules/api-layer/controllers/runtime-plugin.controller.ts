import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RuntimePluginApplicationService } from '../../application/services';

@Controller('runtime-plugins')
export class RuntimePluginController {
  constructor(
    private readonly service: RuntimePluginApplicationService,
  ) {}

  @Post()
  create(
    @Body()
    data: Parameters<RuntimePluginApplicationService['create']>[0],
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
    data: Parameters<RuntimePluginApplicationService['update']>[1],
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