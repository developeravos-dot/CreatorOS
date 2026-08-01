import { ArrayUnique, IsArray, IsBoolean, IsDateString, IsEnum, IsInt, IsObject, IsOptional, IsString, Matches, Max, MaxLength, Min } from 'class-validator';
import {
  GovernanceChangeStatus,
  GovernanceComplianceStatus,
  GovernanceDecisionStatus,
  GovernancePolicyStatus,
  GovernanceRiskLevel,
  GovernanceRiskStatus,
} from '../../../../generated/prisma/enums';
import { Prisma } from '../../../../generated/prisma/client';

export class CreatePolicyDto {
  @IsString() @Matches(/^[a-z0-9._-]{3,100}$/) policyKey!: string;
  @IsString() @MaxLength(180) name!: string;
  @IsOptional() @IsString() @MaxLength(1000) description?: string;
  @IsString() @MaxLength(100) category!: string;
  @IsObject() rules!: Prisma.InputJsonObject;
  @IsOptional() @IsString() @MaxLength(120) owner?: string;
  @IsOptional() @IsDateString() effectiveAt?: string;
  @IsOptional() @IsObject() metadata?: Prisma.InputJsonObject;
}
export class UpdatePolicyDto {
  @IsOptional() @IsString() @MaxLength(180) name?: string;
  @IsOptional() @IsString() @MaxLength(1000) description?: string;
  @IsOptional() @IsString() @MaxLength(100) category?: string;
  @IsOptional() @IsObject() rules?: Prisma.InputJsonObject;
  @IsOptional() @IsString() @MaxLength(120) owner?: string;
  @IsOptional() @IsDateString() effectiveAt?: string;
  @IsOptional() @IsEnum(GovernancePolicyStatus) status?: GovernancePolicyStatus;
  @IsOptional() @IsObject() metadata?: Prisma.InputJsonObject;
}
export class CreateDecisionDto {
  @IsString() @Matches(/^[a-z0-9._-]{3,100}$/) decisionKey!: string;
  @IsString() @MaxLength(220) title!: string;
  @IsString() context!: string;
  @IsString() decision!: string;
  @IsOptional() @IsString() consequences?: string;
  @IsOptional() @IsArray() alternatives?: Prisma.InputJsonArray;
  @IsOptional() @IsString() @MaxLength(60) decisionType?: string;
  @IsOptional() @IsString() @MaxLength(120) owner?: string;
  @IsOptional() @IsObject() metadata?: Prisma.InputJsonObject;
}
export class DecideDecisionDto {
  @IsEnum(GovernanceDecisionStatus) status!: GovernanceDecisionStatus;
  @IsOptional() @IsString() @MaxLength(120) approvedBy?: string;
}
export class CreateRiskDto {
  @IsString() @Matches(/^[a-z0-9._-]{3,100}$/) riskKey!: string;
  @IsString() @MaxLength(220) title!: string;
  @IsString() description!: string;
  @IsString() @MaxLength(100) category!: string;
  @IsInt() @Min(1) @Max(5) likelihood!: number;
  @IsInt() @Min(1) @Max(5) impact!: number;
  @IsOptional() @IsString() @MaxLength(120) owner?: string;
  @IsOptional() @IsString() mitigationPlan?: string;
  @IsOptional() @IsString() contingencyPlan?: string;
  @IsOptional() @IsDateString() reviewAt?: string;
  @IsOptional() @IsObject() metadata?: Prisma.InputJsonObject;
}
export class UpdateRiskDto {
  @IsOptional() @IsEnum(GovernanceRiskStatus) status?: GovernanceRiskStatus;
  @IsOptional() @IsInt() @Min(1) @Max(5) likelihood?: number;
  @IsOptional() @IsInt() @Min(1) @Max(5) impact?: number;
  @IsOptional() @IsString() owner?: string;
  @IsOptional() @IsString() mitigationPlan?: string;
  @IsOptional() @IsString() contingencyPlan?: string;
  @IsOptional() @IsDateString() reviewAt?: string;
}
export class CreateComplianceRuleDto {
  @IsString() @Matches(/^[a-z0-9._-]{3,100}$/) ruleKey!: string;
  @IsString() @MaxLength(220) name!: string;
  @IsOptional() @IsString() description?: string;
  @IsString() @MaxLength(120) framework!: string;
  @IsString() @MaxLength(120) control!: string;
  @IsOptional() @IsEnum(GovernanceRiskLevel) severity?: GovernanceRiskLevel;
  @IsOptional() @IsObject() evidence?: Prisma.InputJsonObject;
  @IsOptional() @IsObject() metadata?: Prisma.InputJsonObject;
}
export class CreateAssessmentDto {
  @IsOptional() @IsString() policyId?: string;
  @IsOptional() @IsString() riskId?: string;
  @IsOptional() @IsString() ruleId?: string;
  @IsString() @MaxLength(120) subjectType!: string;
  @IsOptional() @IsString() subjectId?: string;
  @IsEnum(GovernanceComplianceStatus) status!: GovernanceComplianceStatus;
  @IsOptional() @IsInt() @Min(0) @Max(100) score?: number;
  @IsOptional() @IsObject() findings?: Prisma.InputJsonObject;
  @IsOptional() @IsObject() evidence?: Prisma.InputJsonObject;
  @IsOptional() @IsString() assessedBy?: string;
  @IsOptional() @IsDateString() nextReviewAt?: string;
}
export class CreateChangeRequestDto {
  @IsString() @Matches(/^[a-z0-9._-]{3,100}$/) changeKey!: string;
  @IsString() @MaxLength(220) title!: string;
  @IsString() description!: string;
  @IsString() rationale!: string;
  @IsObject() impactAnalysis!: Prisma.InputJsonObject;
  @IsOptional() @IsString() rollbackPlan?: string;
  @IsOptional() @IsString() requestedBy?: string;
  @IsOptional() @IsObject() metadata?: Prisma.InputJsonObject;
}
export class TransitionChangeDto {
  @IsEnum(GovernanceChangeStatus) status!: GovernanceChangeStatus;
  @IsOptional() @IsString() actor?: string;
}
