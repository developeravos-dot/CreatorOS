import {
  IsArray,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import {
  Type,
} from 'class-transformer';

export class RuntimeManagementListQueryDto {
  @IsOptional()
  @IsString()
  capabilityId?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  lifecycleState?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  pageSize?: number;
}

export class StartManagedRuntimeDto {
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

export class StopManagedRuntimeDto {
  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  actorId?: string;

  @IsOptional()
  @IsString()
  correlationId?: string;
}

export class RestartManagedRuntimeDto {
  @IsOptional()
  @IsString()
  reason?: string;

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

export class BulkRuntimeInstanceIdsDto {
  @IsArray()
  @IsString({
    each: true,
  })
  instanceIds!: string[];

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  actorId?: string;

  @IsOptional()
  @IsString()
  correlationId?: string;
}