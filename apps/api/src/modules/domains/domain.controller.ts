import {
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { DomainService } from './domain.service';

@Controller('domains')
export class DomainController {
  constructor(
    private readonly domainService: DomainService,
  ) {}

  @Get()
  getAll() {
    return this.domainService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    const domain = this.domainService.getById(id);

    if (!domain) {
      throw new NotFoundException(
        `Domain ${id} was not found`,
      );
    }

    return domain;
  }
}
