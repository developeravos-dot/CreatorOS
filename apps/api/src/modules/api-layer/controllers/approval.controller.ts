import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApprovalApplicationService } from '../../application/services';

@Controller('approval-gates')
export class ApprovalController {
  constructor(
    private readonly service: ApprovalApplicationService,
  ) {}

  @Post()
  create(
    @Body()
    data: Parameters<ApprovalApplicationService['create']>[0],
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
    data: Parameters<ApprovalApplicationService['update']>[1],
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