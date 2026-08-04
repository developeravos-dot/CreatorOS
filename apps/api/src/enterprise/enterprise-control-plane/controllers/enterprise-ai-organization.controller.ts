import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import {
  EnterpriseAiOrganizationService,
} from '../services';

@Controller(
  'enterprise/ai-organization',
)
export class EnterpriseAiOrganizationController {
  constructor(
    private readonly organization:
      EnterpriseAiOrganizationService,
  ) {}

  @Get('snapshot')
  snapshot() {
    return this.organization.snapshot();
  }

  @Post('agents')
  registerAgent(
    @Body()
    body: {
      readonly agentId: string;
      readonly displayName: string;
      readonly role: string;
      readonly capabilities:
        readonly string[];
      readonly maximumAssignments: number;
    },
  ) {
    return this.organization.registerAgent(
      body,
    );
  }

  @Post('teams')
  createTeam(
    @Body()
    body: {
      readonly teamId: string;
      readonly displayName: string;
      readonly agentIds:
        readonly string[];
      readonly mission: string;
    },
  ) {
    return this.organization.createTeam(
      body,
    );
  }

  @Post('assignments')
  assign(
    @Body()
    body: {
      readonly assignmentId: string;
      readonly teamId: string;
      readonly objective: string;
      readonly requiredCapabilities:
        readonly string[];
      readonly priority: number;
    },
  ) {
    return this.organization.assign(
      body,
    );
  }
}
