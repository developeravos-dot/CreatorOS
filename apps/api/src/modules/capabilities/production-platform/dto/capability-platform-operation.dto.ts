import {
  IsArray,
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterCapabilityDto {
  @IsObject()
  manifest!: Record<string, unknown>;

  @IsOptional()
  @IsString()
  actorId?: string;

  @IsOptional()
  @IsString()
  correlationId?: string;
}

export class StartCapabilityRuntimeDto {
  @IsString()
  @MinLength(1)
  capabilityId!: string;

  @IsOptional()
  @IsString()
  actorId?: string;

  @IsOptional()
  @IsString()
  correlationId?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class StopCapabilityRuntimeDto {
  @IsString()
  @MinLength(1)
  instanceId!: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
