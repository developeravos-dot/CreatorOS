import { IsDateString, IsEnum, IsInt, IsObject, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { OpsDeploymentStatus, OpsIncidentSeverity, OpsIncidentStatus, OpsServiceStatus } from '../../../../generated/prisma/enums';

export class CreateOpsServiceDto {
  @IsString() @MaxLength(80) serviceKey!: string;
  @IsString() @MaxLength(160) name!: string;
  @IsOptional() @IsString() @MaxLength(500) description?: string;
  @IsOptional() @IsString() @MaxLength(120) owner?: string;
  @IsOptional() @IsEnum(OpsServiceStatus) status?: OpsServiceStatus;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}
export class UpdateOpsServiceDto {
  @IsOptional() @IsString() @MaxLength(160) name?: string;
  @IsOptional() @IsString() @MaxLength(500) description?: string;
  @IsOptional() @IsString() @MaxLength(120) owner?: string;
  @IsOptional() @IsEnum(OpsServiceStatus) status?: OpsServiceStatus;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}
export class CreateIncidentDto {
  @IsOptional() @IsString() serviceId?: string;
  @IsString() @MaxLength(180) title!: string;
  @IsString() @MaxLength(4000) description!: string;
  @IsEnum(OpsIncidentSeverity) severity!: OpsIncidentSeverity;
  @IsOptional() @IsString() @MaxLength(120) commander?: string;
}
export class UpdateIncidentDto {
  @IsOptional() @IsEnum(OpsIncidentStatus) status?: OpsIncidentStatus;
  @IsOptional() @IsEnum(OpsIncidentSeverity) severity?: OpsIncidentSeverity;
  @IsOptional() @IsString() @MaxLength(120) commander?: string;
  @IsOptional() @IsString() @MaxLength(4000) resolution?: string;
}
export class CreateRunbookDto {
  @IsString() @MaxLength(80) runbookKey!: string;
  @IsString() @MaxLength(180) title!: string;
  @IsString() content!: string;
  @IsOptional() @IsString() serviceId?: string;
  @IsOptional() @IsString() @MaxLength(120) owner?: string;
}
export class CreateSlaDto {
  @IsString() serviceId!: string;
  @IsString() @MaxLength(120) name!: string;
  @IsInt() @Min(1) @Max(100) targetAvailability!: number;
  @IsInt() @Min(1) responseMinutes!: number;
  @IsInt() @Min(1) resolutionMinutes!: number;
}
export class CreateDeploymentDto {
  @IsString() serviceId!: string;
  @IsString() @MaxLength(120) version!: string;
  @IsOptional() @IsString() @MaxLength(80) environment?: string;
  @IsOptional() @IsString() @MaxLength(120) initiatedBy?: string;
}
export class TransitionDeploymentDto {
  @IsEnum(OpsDeploymentStatus) status!: OpsDeploymentStatus;
  @IsOptional() @IsDateString() completedAt?: string;
  @IsOptional() @IsString() @MaxLength(1000) notes?: string;
}
