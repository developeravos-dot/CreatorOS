import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AgentDecisionStatus, AgentMissionStatus } from '../../../generated/prisma/enums';
import { RequirePermissions } from '../security/permissions.decorator';
import { Permissions } from '../security/permissions';
import { AddAgentTeamMemberDto, AssignAgentMissionDto, CreateAgentDecisionDto, CreateAgentMissionDto, CreateAgentTeamDto, ReviewAgentDecisionDto, TransitionAgentMissionDto, UpdateAgentTeamDto } from './dto/ai-organization.dto';
import { AiOrganizationService } from './ai-organization.service';

@ApiTags('AI Organization')
@ApiBearerAuth()
@Controller('ai-organization')
export class AiOrganizationController {
  constructor(private readonly organization: AiOrganizationService) {}

  @Get('dashboard') @RequirePermissions(Permissions.AiOrganizationDashboardRead) dashboard() { return this.organization.dashboard(); }

  @Get('teams') @RequirePermissions(Permissions.AiTeamsRead) teams() { return this.organization.listTeams(); }
  @Post('teams') @RequirePermissions(Permissions.AiTeamsWrite) createTeam(@Body() body: CreateAgentTeamDto) { return this.organization.createTeam(body); }
  @Patch('teams/:id') @RequirePermissions(Permissions.AiTeamsWrite) updateTeam(@Param('id') id: string, @Body() body: UpdateAgentTeamDto) { return this.organization.updateTeam(id, body); }
  @Post('teams/:id/members') @RequirePermissions(Permissions.AiTeamsWrite) addMember(@Param('id') id: string, @Body() body: AddAgentTeamMemberDto) { return this.organization.addMember(id, body); }
  @Delete('teams/:id/members/:agentId') @RequirePermissions(Permissions.AiTeamsWrite) removeMember(@Param('id') id: string, @Param('agentId') agentId: string) { return this.organization.removeMember(id, agentId); }

  @Get('missions') @RequirePermissions(Permissions.AiMissionsRead) missions(@Query('status') status?: AgentMissionStatus) { return this.organization.listMissions(status); }
  @Post('missions') @RequirePermissions(Permissions.AiMissionsWrite) createMission(@Body() body: CreateAgentMissionDto) { return this.organization.createMission(body); }
  @Post('missions/:id/assignments') @RequirePermissions(Permissions.AiMissionsWrite) assignMission(@Param('id') id: string, @Body() body: AssignAgentMissionDto) { return this.organization.assignMission(id, body); }
  @Patch('missions/:id/status') @RequirePermissions(Permissions.AiMissionsExecute) transitionMission(@Param('id') id: string, @Body() body: TransitionAgentMissionDto) { return this.organization.transitionMission(id, body); }

  @Get('decisions') @RequirePermissions(Permissions.AiDecisionsRead) decisions(@Query('status') status?: AgentDecisionStatus) { return this.organization.listDecisions(status); }
  @Post('decisions') @RequirePermissions(Permissions.AiDecisionsWrite) createDecision(@Body() body: CreateAgentDecisionDto) { return this.organization.createDecision(body); }
  @Patch('decisions/:id/review') @RequirePermissions(Permissions.AiDecisionsApprove) reviewDecision(@Param('id') id: string, @Body() body: ReviewAgentDecisionDto) { return this.organization.reviewDecision(id, body); }
}
