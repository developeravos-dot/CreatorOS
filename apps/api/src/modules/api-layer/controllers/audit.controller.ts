import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { AuditApplicationService } from '../../application/services';

@Controller('audit-logs')
export class AuditController {
  constructor(
    private readonly service: AuditApplicationService,
  ) {}

  @Post()
  record(
    @Body()
    data: Parameters<AuditApplicationService['record']>[0],
  ) {
    return this.service.record(data);
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

  @Delete(':id')
  remove(
    @Param('id')
    id: string,
  ) {
    return this.service.remove(id);
  }
}