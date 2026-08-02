import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
} from '@nestjs/common';

import type {
  AiOrganizationWorkspaceStateInput,
} from './ai-organization-persistence.contracts';

import {
  AiOrganizationPersistenceService,
} from './ai-organization-persistence.service';

@Controller(
  'enterprise/ai-organization/persistence',
)
export class AiOrganizationPersistenceController {
  constructor(
    private readonly service:
      AiOrganizationPersistenceService,
  ) {}

  @Get('health')
  getHealth() {
    return this.service.getHealth();
  }

  @Get('workspaces')
  list() {
    return this.service.list();
  }

  @Get('workspaces/:workspaceKey')
  get(
    @Param('workspaceKey')
    workspaceKey: string,
  ) {
    return this.service.getOptional(workspaceKey);
  }

  @Put('workspaces/:workspaceKey')
  save(
    @Param('workspaceKey')
    workspaceKey: string,

    @Body()
    input: Omit<
      AiOrganizationWorkspaceStateInput,
      'workspaceKey'
    >,
  ) {
    return this.service.save(
      workspaceKey,
      input,
    );
  }

  @Delete('workspaces/:workspaceKey')
  delete(
    @Param('workspaceKey')
    workspaceKey: string,
  ) {
    return this.service.delete(workspaceKey);
  }
}
