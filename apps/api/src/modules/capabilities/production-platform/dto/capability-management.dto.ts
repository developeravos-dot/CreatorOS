import {
  IsArray,
  IsBoolean,
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

export class CapabilityManagementListQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  domain?: string;

  @IsOptional()
  @IsString()
  state?: string;

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

  @IsOptional()
  @IsString()
  sortBy?:
    | 'id'
    | 'name'
    | 'domain'
    | 'version'
    | 'registeredAt'
    | 'updatedAt';

  @IsOptional()
  @IsString()
  sortDirection?:
    | 'asc'
    | 'desc';
}

export class RegisterManagedCapabilityDto {
  @IsObject()
  manifest!: Record<string, unknown>;

  @IsOptional()
  @IsString()
  actorId?: string;

  @IsOptional()
  @IsString()
  correlationId?: string;
}

export class ValidateCapabilityManifestDto {
  @IsObject()
  manifest!: Record<string, unknown>;
}

export class BulkCapabilityIdsDto {
  @IsArray()
  @IsString({
    each: true,
  })
  capabilityIds!: string[];

  @IsOptional()
  @IsString()
  actorId?: string;

  @IsOptional()
  @IsString()
  correlationId?: string;
}

export class ResolveManagedDependenciesDto {
  @IsString()
  @MinLength(1)
  rootCapabilityId!: string;

  @IsArray()
  catalog!: Record<string, unknown>[];

  @IsOptional()
  @IsBoolean()
  includeOptional?: boolean;

  @IsOptional()
  @IsBoolean()
  enforcePeerDependencies?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}