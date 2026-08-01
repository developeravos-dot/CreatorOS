import { IsArray, IsEnum, IsInt, IsObject, IsOptional, IsString, Max, Min } from 'class-validator';
import { AgentDecisionStatus, AgentMissionPriority, AgentMissionStatus, AgentTeamStatus } from '../../../../generated/prisma/enums';

export class CreateAgentTeamDto {
  @IsString() teamKey!: string;
  @IsString() name!: string;
  @IsOptional() @IsString() purpose?: string;
  @IsOptional() @IsString() organizationUnitId?: string;
  @IsOptional() @IsObject() operatingModel?: Record<string, unknown>;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class UpdateAgentTeamDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() purpose?: string;
  @IsOptional() @IsString() organizationUnitId?: string;
  @IsOptional() @IsEnum(AgentTeamStatus) status?: AgentTeamStatus;
  @IsOptional() @IsObject() operatingModel?: Record<string, unknown>;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class AddAgentTeamMemberDto {
  @IsString() agentId!: string;
  @IsString() role!: string;
  @IsOptional() @IsInt() @Min(0) @Max(100) priority?: number;
  @IsOptional() @IsObject() responsibilities?: Record<string, unknown>;
}

export class CreateAgentMissionDto {
  @IsString() missionKey!: string;
  @IsString() title!: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() teamId?: string;
  @IsEnum(AgentMissionPriority) priority!: AgentMissionPriority;
  @IsOptional() @IsObject() objective?: Record<string, unknown>;
  @IsOptional() @IsArray() requiredCapabilities?: string[];
  @IsOptional() @IsObject() constraints?: Record<string, unknown>;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class AssignAgentMissionDto {
  @IsString() agentId!: string;
  @IsOptional() @IsString() assignmentRole?: string;
  @IsOptional() @IsObject() instructions?: Record<string, unknown>;
}

export class TransitionAgentMissionDto {
  @IsEnum(AgentMissionStatus) status!: AgentMissionStatus;
  @IsOptional() @IsString() note?: string;
  @IsOptional() @IsObject() result?: Record<string, unknown>;
}

export class CreateAgentDecisionDto {
  @IsString() decisionKey!: string;
  @IsString() title!: string;
  @IsString() summary!: string;
  @IsOptional() @IsString() missionId?: string;
  @IsOptional() @IsString() proposedByAgentId?: string;
  @IsOptional() @IsObject() options?: Record<string, unknown>;
  @IsOptional() @IsObject() recommendation?: Record<string, unknown>;
  @IsOptional() @IsObject() riskAssessment?: Record<string, unknown>;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class ReviewAgentDecisionDto {
  @IsEnum(AgentDecisionStatus) status!: AgentDecisionStatus;
  @IsOptional() @IsString() reviewNote?: string;
}
