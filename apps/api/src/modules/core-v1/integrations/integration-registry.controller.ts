import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IntegrationRegistryService } from './integration-registry.service';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles';

@ApiTags('Integration Registry')
@ApiBearerAuth()
@Roles(Role.Admin, Role.Operator, Role.Viewer)
@Controller('integration-registry')
export class IntegrationRegistryController {
  constructor(
    private readonly registry: IntegrationRegistryService,
  ) {}

  @Get()
  list() {
    return this.registry.list();
  }

  @Get(':key')
  get(@Param('key') key: string) {
    return this.registry.get(key) ?? null;
  }
}