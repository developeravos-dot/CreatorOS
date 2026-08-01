import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AgentApplicationService } from '../../application/services';

@Controller('agents')
export class AgentController {
  constructor(
    private readonly service: AgentApplicationService,
  ) {}

  @Post()
  create(
    @Body()
    data: Parameters<AgentApplicationService['create']>[0],
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
    data: Parameters<AgentApplicationService['update']>[1],
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